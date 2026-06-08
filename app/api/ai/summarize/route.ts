import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { content } = await req.json()
    if (!content?.trim()) return NextResponse.json({ error: 'Content is required' }, { status: 400 })

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-oss-120b:free',
      messages: [
        {
          role: 'system',
          content: `You are a highly precise academic summarization assistant. Your task is to analyze study notes and extract the core concepts clearly and concisely.

Based on the provided NOTES, generate a JSON object with this exact structure:
{
  "summary": "A concise, academic summary of the notes (exactly 2 to 4 sentences).",
  "keyPoints": [
    "Key point 1 detailing a crucial concept.",
    "Key point 2 detailing another key concept."
  ]
}

Instructions:
1. Provide exactly 4 to 6 key points in the "keyPoints" array.
2. Ensure the "summary" is brief, clear, and fits in 2-4 sentences.
3. Output ONLY raw valid JSON. Do not include markdown code block syntax (like \`\`\`json), comments, or conversational text.`
        },
        { role: 'user', content: `Summarize these notes:\n\n${content}` }
      ],
      temperature: 0.4,
      max_tokens: 800
    })

    const rawContent = completion.choices[0].message.content || '{}'
    let cleaned = rawContent.trim()

    // Robust parsing: extract JSON from markdown block if model outputted one
    const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i
    const match = cleaned.match(jsonBlockRegex)
    if (match) {
      cleaned = match[1].trim()
    }

    const result = JSON.parse(cleaned)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Summarize error:', error)
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
  }
}
