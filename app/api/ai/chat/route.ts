import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { createClient } from '@/lib/supabase/server'
import type { ChatMessage } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { content, messages }: { content: string; messages: ChatMessage[] } = await req.json()
    if (!content?.trim()) return NextResponse.json({ error: 'Content is required' }, { status: 400 })

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-oss-120b:free',
      messages: [
        {
          role: 'system',
          content: `You are a precise and helpful study assistant. Your sole source of truth is the provided study notes. You must answer the user's questions accurately and concisely based strictly on the provided NOTES.

NOTES:
${content}

Instructions:
1. Answer questions ONLY using facts directly mentioned in the NOTES above.
2. If the answer cannot be logically inferred from the provided NOTES, say: "I'm sorry, but that information is not present in your notes. Would you like me to explain anything else from the notes?"
3. Keep your answers brief, clear, and highly focused on the student's question.`
        },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ],
      temperature: 0.3,
      max_tokens: 600,
    })

    const reply = completion.choices[0].message.content || 'I could not generate a response.'
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to generate chat response' }, { status: 500 })
  }
}
