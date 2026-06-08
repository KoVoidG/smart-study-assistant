import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || ''
    const subject = searchParams.get('subject') || ''
    const favorites = searchParams.get('favorites') === 'true'
    const includeHistory = searchParams.get('history') === 'true'

    let query = supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) query = query.ilike('title', `%${search}%`)
    if (subject) query = query.eq('subject', subject)
    if (favorites) query = query.eq('is_favorite', true)
    if (!includeHistory) query = query.not('title', 'like', '__history__%')

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ notes: data || [] })
  } catch (error) {
    console.error('Notes GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { title, content, subject } = await req.json()
    if (!content?.trim()) return NextResponse.json({ error: 'Content is required' }, { status: 400 })

    let finalSubject = subject || 'General'
    if (!subject || subject === 'General') {
      finalSubject = await classifySubject(content)
    }

    const isHistorySave = title?.startsWith('__history__')

    let noteData;
    
    // Check if a note with the exact same content already exists
    const { data: existing } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .eq('content', content)
      .limit(1)

    if (existing && existing.length > 0) {
      const existingNote = existing[0]
      const existingIsHistory = existingNote.title.startsWith('__history__')

      if (isHistorySave) {
        if (existingIsHistory) {
          // If the existing note is also a history note, touch its timestamps to bring it to the top
          const { data: updated, error: updateErr } = await supabase
            .from('notes')
            .update({
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString() // Touch created_at so it sorts to the top of the list
            })
            .eq('id', existingNote.id)
            .select()
            .single()

          if (updateErr) throw updateErr
          noteData = updated
        } else {
          // If it is already a saved note, do nothing, just return it
          noteData = existingNote
        }
      } else {
        if (existingIsHistory) {
          // Upgrade history note to saved note
          const cleanTitle = title || existingNote.title.replace('__history__', '')
          const { data: updated, error: updateErr } = await supabase
            .from('notes')
            .update({
              title: cleanTitle,
              subject: finalSubject,
              updated_at: new Date().toISOString(),
              created_at: new Date().toISOString() // Bring it to the top as a saved note
            })
            .eq('id', existingNote.id)
            .select()
            .single()

          if (updateErr) throw updateErr
          noteData = updated
        } else {
          // It is already a saved note. Just update its title/subject if requested
          const { data: updated, error: updateErr } = await supabase
            .from('notes')
            .update({
              title: title || existingNote.title,
              subject: finalSubject,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingNote.id)
            .select()
            .single()

          if (updateErr) throw updateErr
          noteData = updated
        }
      }
    }

    if (!noteData) {
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: title || content.slice(0, 60) + '...',
          content,
          subject: finalSubject,
          is_favorite: false,
        })
        .select()
        .single()

      if (error) throw error
      noteData = data
    }

    // Update study streak
    await updateStudyStreak(supabase, user.id)

    return NextResponse.json({ note: noteData }, { status: 201 })
  } catch (error) {
    console.error('Notes POST error:', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}

async function updateStudyStreak(supabase: ReturnType<typeof import('@/lib/supabase/server').createClient> extends Promise<infer T> ? T : never, userId: string) {
  const today = new Date().toISOString().split('T')[0]
  const { data: profile } = await supabase.from('profiles').select('study_streak, last_study_date').eq('id', userId).single()

  if (!profile) return

  const lastDate = profile.last_study_date
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let newStreak = profile.study_streak || 0
  if (lastDate === today) return // already studied today
  if (lastDate === yesterdayStr) newStreak += 1 // consecutive day
  else newStreak = 1 // streak broken

  await supabase.from('profiles').update({ study_streak: newStreak, last_study_date: today }).eq('id', userId)
}

async function classifySubject(content: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'openai/gpt-oss-120b:free',
      messages: [
        {
          role: 'system',
          content: 'You are an AI subject classifier. Analyze the user study notes and classify them into exactly one of these subjects: Biology, Physics, Chemistry, Mathematics, Computer Science, History, Literature, Economics, or Other. Return ONLY the single matching subject name as plain text. Do not write a sentence, introduction, or explanation. Example response: Biology'
        },
        {
          role: 'user',
          content: content.slice(0, 1500)
        }
      ],
      temperature: 0.1,
      max_tokens: 10
    })
    
    const reply = response.choices[0]?.message?.content?.trim() || 'Other'
    
    // Exact matching validation
    const categories = ['Biology', 'Physics', 'Chemistry', 'Mathematics', 'Computer Science', 'History', 'Literature', 'Economics', 'Other']
    const matched = categories.find(cat => reply.toLowerCase().includes(cat.toLowerCase()))
    return matched || 'Other'
  } catch (err) {
    console.error('AI Subject Classification error:', err)
    return 'Other'
  }
}
