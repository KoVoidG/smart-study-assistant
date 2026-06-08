'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { Sparkles, Loader2, Save, CheckCheck } from 'lucide-react'
import NoteInput from '@/components/dashboard/NoteInput'
import ActionCards from '@/components/dashboard/ActionCards'
import AIResultPanel from '@/components/dashboard/AIResultPanel'
import RecentNotes from '@/components/dashboard/RecentNotes'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import type { ActionType, SummaryResult, QuizResult, ExplanationResult, ChatMessage, Note, NoteWithResults } from '@/types'
import toast from 'react-hot-toast'

function DashboardContent() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const [noteText, setNoteText] = useState('')
  const [selectedAction, setSelectedAction] = useState<ActionType>('summarize')
  const [loading, setLoading] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [explanationResult, setExplanationResult] = useState<ExplanationResult | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [recentNotes, setRecentNotes] = useState<Note[]>([])
  const [saving, setSaving] = useState(false)
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null)

  const fetchRecentNotes = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(4)
    if (data) setRecentNotes(data)
  }, [supabase])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecentNotes()
  }, [fetchRecentNotes])

  const saveAIResult = async (noteId: string, type: 'summary' | 'quiz' | 'explanation' | 'chat', resultData: any) => {
    try {
      const res = await fetch('/api/ai-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId, type, resultData })
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        console.error('Failed to save AI result server-side:', errData.error)
      }
    } catch (err) {
      console.error('Error saving AI result:', err)
    }
  }

  // Load note if noteId or id is present in URL
  useEffect(() => {
    const noteId = searchParams.get('noteId') || searchParams.get('id')
    if (!noteId) return

    const fetchNoteDetails = async () => {
      try {
        const res = await fetch(`/api/notes/${noteId}`)
        if (!res.ok) throw new Error('Note not found')
        const data = await res.json()
        const note: NoteWithResults = data.note
        if (note) {
          setNoteText(note.content)
          setCurrentNoteId(note.id)

          // Reset existing AI results first
          setSummaryResult(null)
          setQuizResult(null)
          setExplanationResult(null)
          setChatMessages([])

          // Load associated AI results
          if (note.ai_results && note.ai_results.length > 0) {
            let preferredAction: ActionType | null = null
            note.ai_results.forEach(result => {
              if (result.type === 'summary') {
                setSummaryResult(result.result_data as SummaryResult)
                if (!preferredAction) preferredAction = 'summarize'
              } else if (result.type === 'quiz') {
                setQuizResult(result.result_data as QuizResult)
                if (!preferredAction) preferredAction = 'quiz'
              } else if (result.type === 'explanation') {
                setExplanationResult(result.result_data as ExplanationResult)
                if (!preferredAction) preferredAction = 'explain'
              } else if (result.type === 'chat') {
                const chatData = result.result_data as any
                setChatMessages(chatData.messages || [])
                if (!preferredAction) preferredAction = 'chat'
              }
            })
            if (preferredAction) {
              setSelectedAction(preferredAction)
            }
          }
        }
      } catch (err) {
        console.error('Error fetching note details:', err)
        toast.error('Failed to load note details')
      }
    }

    fetchNoteDetails()
  }, [searchParams])

  const handleGenerate = async () => {
    if (!noteText.trim()) {
      toast.error('Please enter some notes first')
      return
    }
    setLoading(true)
    try {
      let noteId = currentNoteId

      if (selectedAction !== 'chat') {
        const noteRes = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: noteText,
            title: '__history__' + (noteText.slice(0, 50) + '...'),
            subject: 'General'
          })
        })
        if (noteRes.ok) {
          const noteData = await noteRes.json()
          noteId = noteData.note.id
          setCurrentNoteId(noteId)
          fetchRecentNotes()
        }
      }

      if (selectedAction === 'summarize') {
        const res = await fetch('/api/ai/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: noteText }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || `Request failed (${res.status})`)
        }
        const data = await res.json()
        setSummaryResult(data)
        if (noteId) {
          await saveAIResult(noteId, 'summary', data)
        }
      } else if (selectedAction === 'quiz') {
        const res = await fetch('/api/ai/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: noteText }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || `Request failed (${res.status})`)
        }
        const data = await res.json()
        setQuizResult(data)
        if (noteId) {
          await saveAIResult(noteId, 'quiz', data)
        }
      } else if (selectedAction === 'explain') {
        const res = await fetch('/api/ai/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: noteText }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          throw new Error(err.error || `Request failed (${res.status})`)
        }
        const data = await res.json()
        setExplanationResult(data)
        if (noteId) {
          await saveAIResult(noteId, 'explanation', data)
        }
      } else if (selectedAction === 'chat') {
        toast('Switched to Chat tab — ask your question below!', { icon: '💬' })
        return
      }
      toast.success('AI result ready!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate. Please try again.'
      toast.error(msg)
      console.error('Generate error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChat = async (message: string) => {
    if (!noteText.trim()) {
      toast.error('Please enter your notes first so AI can answer based on them')
      return
    }

    let noteId = currentNoteId
    if (!noteId) {
      const noteRes = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: noteText,
          title: '__history__' + (noteText.slice(0, 50) + '...'),
          subject: 'General'
        })
      })
      if (noteRes.ok) {
        const noteData = await noteRes.json()
        noteId = noteData.note.id
        setCurrentNoteId(noteId)
        fetchRecentNotes()
      }
    }

    const updatedMessages = [...chatMessages, { role: 'user' as const, content: message }]
    setChatMessages(updatedMessages)
    setChatLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: noteText, messages: updatedMessages }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `Chat request failed (${res.status})`)
      }
      const data = await res.json()
      const finalMessages = [...updatedMessages, { role: 'assistant' as const, content: data.reply }]
      setChatMessages(finalMessages)

      if (noteId) {
        await saveAIResult(noteId, 'chat', { messages: finalMessages })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Chat failed. Please try again.'
      toast.error(msg)
      setChatMessages(prev => prev.slice(0, -1))
    } finally {
      setChatLoading(false)
    }
  }

  const handleSaveNote = async () => {
    if (!noteText.trim()) { toast.error('Nothing to save'); return }
    setSaving(true)
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: noteText, title: noteText.slice(0, 60) + '...', subject: 'General' }),
    })
    if (res.ok) {
      const data = await res.json()
      setCurrentNoteId(data.note.id)
      toast.success('Note saved!')
      fetchRecentNotes()
    } else {
      toast.error('Failed to save note')
    }
    setSaving(false)
  }

  const isSaved = recentNotes.some(n => n.content.trim() === noteText.trim() && !n.title.startsWith('__history__'))

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Row 1 — Your Notes + AI Result Panel (Equal Widths) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Column 1 — Your Notes */}
        <div className="flex flex-col h-[500px] lg:h-[600px] space-y-4">
          <div className="flex-1 min-h-0">
            <NoteInput
              value={noteText}
              onChange={(val) => {
                setNoteText(val)
                setCurrentNoteId(null)
                setSummaryResult(null)
                setQuizResult(null)
                setExplanationResult(null)
                setChatMessages([])
              }}
              onFileUpload={(val) => {
                setNoteText(val)
                setCurrentNoteId(null)
                setSummaryResult(null)
                setQuizResult(null)
                setExplanationResult(null)
                setChatMessages([])
              }}
            />
          </div>
          <ActionCards selected={selectedAction} onSelect={setSelectedAction} />

          {/* Generate + Save buttons */}
          <div className="flex gap-2">
            <button
              id="generate-btn"
              onClick={handleGenerate}
              disabled={loading || !noteText.trim()}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-2xl text-sm hover-shadow-glow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Generating...' : 'Generate'}
            </button>
            <button
              id="save-note-btn"
              onClick={handleSaveNote}
              disabled={saving || !noteText.trim() || isSaved}
              className="flex items-center gap-1.5 px-4 py-3.5 border border-token text-muted-token font-medium rounded-2xl text-sm hover:border-violet-300 hover:text-violet-600 disabled:opacity-50 transition-all cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isSaved ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Column 2 — AI Result Panel */}
        <div className="h-[500px] lg:h-[600px] lg:border-l lg:border-[var(--border-subtle)] lg:pl-6 xl:pl-8 flex flex-col">
          <AIResultPanel
            activeAction={selectedAction}
            loading={loading}
            summaryResult={summaryResult}
            quizResult={quizResult}
            explanationResult={explanationResult}
            chatMessages={chatMessages}
            onChat={handleChat}
            chatLoading={chatLoading}
          />
        </div>
      </div>

      {/* Row 2 — Recent Notes (Spans entire width) */}
      <RecentNotes notes={recentNotes} />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
        <p className="text-sm text-[var(--text-faint)]">Loading dashboard...</p>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
