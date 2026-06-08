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
          content: `You are a professional educational assessment developer. Your task is to generate high-quality quiz questions to test comprehension of the provided student notes. 

Analyze the provided NOTES and generate a JSON object containing exactly 5 questions based strictly on the content of the notes.
The JSON object must have this exact structure:
{
  "questions": [
    {
      "question": "Clear, direct question text matching the notes.",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A"
    },
    {
      "question": "Clear, direct question text matching the notes.",
      "type": "short_answer",
      "answer": "The expected correct answer phrase."
    }
  ]
}

Instructions:
1. Generate exactly 5 questions: mix 3 multiple_choice questions and 2 short_answer questions.
2. For multiple_choice questions, ensure there are exactly 4 logical options, and one correct answer that matches exactly one of the options.
3. For short_answer questions, do not include an "options" field.
4. Output ONLY the raw valid JSON. Do not write any explanations, markdown code blocks, or extra text before or after the JSON.`
        },
        { role: 'user', content: `Create quiz questions from these notes:\n\n${content}` }
      ],
      temperature: 0.5,
      max_tokens: 1200
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
    console.error('Quiz error:', error)
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 })
  }
}
