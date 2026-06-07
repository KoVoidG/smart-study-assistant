export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  study_streak: number
  last_study_date: string | null
  created_at: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  subject: string | null
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export interface AIResult {
  id: string
  note_id: string
  type: 'summary' | 'quiz' | 'explanation' | 'chat'
  result_data: SummaryResult | QuizResult | ExplanationResult | ChatResult
  was_helpful: boolean | null
  created_at: string
}

export interface SummaryResult {
  summary: string
  keyPoints: string[]
}

export interface QuizQuestion {
  question: string
  type: 'multiple_choice' | 'short_answer'
  options?: string[]
  answer: string
}

export interface QuizResult {
  questions: QuizQuestion[]
}

export interface ExplanationResult {
  explanation: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResult {
  messages: ChatMessage[]
}

export type ActionType = 'summarize' | 'quiz' | 'explain' | 'chat'

export interface NoteWithResults extends Note {
  ai_results?: AIResult[]
}
