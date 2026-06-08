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
          content: `You are an expert, encouraging teacher skilled in pedagogical simplification. Your task is to explain complex concepts in a highly accessible manner suited for a 10-year-old student.

Based on the provided NOTES, generate a JSON object with this exact structure:
{
  "explanation": "Simple explanation here."
}

Instructions:
1. Explain the topics in the notes clearly using simple words, friendly tone, helpful everyday analogies, and short sentences.
2. Keep the explanation concise (exactly 3 to 5 sentences).
3. Output ONLY raw valid JSON. Do not include markdown code block formatting, introductory remarks, or trailing remarks.`
        },
        { role: 'user', content: `Explain this simply:\n\n${content}` }
      ],
      temperature: 0.6,
      max_tokens: 500
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
    console.error('Explain error:', error)
    return NextResponse.json({ error: 'Failed to generate explanation' }, { status: 500 })
  }
}
