import OpenAI from 'openai'

const isOpenRouter = process.env.OPENAI_API_KEY?.startsWith('sk-or-')

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: isOpenRouter ? 'https://openrouter.ai/api/v1' : undefined,
  defaultHeaders: isOpenRouter ? {
    'HTTP-Referer': 'https://localhost:3000',
    'X-Title': 'Smart Study Assistant',
  } : undefined
})
