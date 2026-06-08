import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { noteId, type, resultData } = await req.json()
    if (!noteId || !type || !resultData) {
      return NextResponse.json({ error: 'noteId, type, and resultData are required' }, { status: 400 })
    }

    // Check if user owns the note
    const { data: note, error: noteErr } = await supabase
      .from('notes')
      .select('id')
      .eq('id', noteId)
      .eq('user_id', user.id)
      .single()

    if (noteErr || !note) {
      return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 })
    }

    // Check if an AI result of this type already exists for this note
    const { data: existing, error: fetchErr } = await supabase
      .from('ai_results')
      .select('id')
      .eq('note_id', noteId)
      .eq('type', type)

    if (fetchErr) throw fetchErr

    let result;
    if (existing && existing.length > 0) {
      // Update
      const { data, error: updateErr } = await supabase
        .from('ai_results')
        .update({
          result_data: resultData,
          created_at: new Date().toISOString()
        })
        .eq('id', existing[0].id)
        .select()
        .single()
      if (updateErr) throw updateErr
      result = data
    } else {
      // Insert
      const { data, error: insertErr } = await supabase
        .from('ai_results')
        .insert({
          note_id: noteId,
          user_id: user.id,
          type,
          result_data: resultData
        })
        .select()
        .single()
      if (insertErr) throw insertErr
      result = data
    }

    return NextResponse.json({ success: true, ai_result: result })
  } catch (error) {
    console.error('Save AI Result API error:', error)
    return NextResponse.json({ error: 'Failed to save AI result' }, { status: 500 })
  }
}
