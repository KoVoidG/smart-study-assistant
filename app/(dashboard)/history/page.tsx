'use client'

import { useState, useEffect } from 'react'
import { Clock, FileText, Save, Trash2 } from 'lucide-react'
import { formatDate, getSubjectColor } from '@/lib/utils'
import type { Note } from '@/types'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function HistoryPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const saveHistoryNote = async (note: Note) => {
    try {
      const cleanTitle = note.title.replace(/^__history__/, '')
      const res = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: cleanTitle })
      })
      if (!res.ok) throw new Error('Failed to save note')
      const data = await res.json()
      if (data.note) {
        setNotes(prev => prev.map(n => n.id === note.id ? data.note : n))
        toast.success('Note saved successfully!')
      } else {
        throw new Error('No note data returned')
      }
    } catch (err) {
      console.error('Error saving history note:', err)
      toast.error('Failed to save note. Please try again.')
    }
  }

  const deleteHistoryNote = (id: string) => {
    setDeleteConfirmId(id)
  }

  const confirmDeleteHistoryNote = async () => {
    if (!deleteConfirmId) return
    try {
      const id = deleteConfirmId
      setDeleteConfirmId(null)
      const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete note')
      setNotes(prev => prev.filter(n => n.id !== id))
      toast.success('Deleted study session')
    } catch (err) {
      console.error('Error deleting history note:', err)
      toast.error('Failed to delete history note')
    }
  }

  useEffect(() => {
    fetch('/api/notes?limit=50&history=true')
      .then(r => r.json())
      .then(d => { setNotes(d.notes || []); setLoading(false) })
  }, [])


  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>History</h1>
        <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Your past study sessions</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="skeleton h-5 w-20 rounded-lg" />
              <div className="skeleton h-4 rounded" />
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-3 w-20 rounded mt-2" />
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(124, 58, 237, 0.08)' }}>
            <Clock className="w-7 h-7" style={{ color: 'var(--brand)' }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>No history yet</h3>
          <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Your study sessions will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(note => (
            <div key={note.id} className="card p-5 hover:-translate-y-0.5 relative group flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-2 py-0.5 rounded-lg text-xs font-medium ${getSubjectColor(note.subject)}`}>
                    {note.subject || 'General'}
                  </div>
                  <button
                    id={`del-history-${note.id}`}
                    onClick={() => deleteHistoryNote(note.id)}
                    className="icon-btn !w-6 !h-6 z-10 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    title="Delete study session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <Link href={`/dashboard?noteId=${note.id}`} className="block group/link cursor-pointer">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: 'rgba(124, 58, 237, 0.08)' }}>
                    <FileText className="w-4 h-4" style={{ color: 'var(--brand)' }} />
                  </div>
                  <h3 className="text-sm font-semibold mb-1.5 line-clamp-2 group-hover/link:text-[var(--brand)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {note.title.startsWith('__history__') ? note.title.replace('__history__', '') : note.title}
                  </h3>
                  <p className="text-xs line-clamp-3 mb-3 leading-relaxed" style={{ color: 'var(--text-faint)' }}>{note.content}</p>
                </Link>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{formatDate(note.created_at)}</p>
                {note.title.startsWith('__history__') ? (
                  <button
                    onClick={() => saveHistoryNote(note)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg hover-shadow-glow flex items-center gap-1 transition-all cursor-pointer z-10"
                    style={{
                      background: 'var(--brand)',
                      color: 'white',
                    }}
                  >
                    <Save className="w-3 h-3" />
                    Save
                  </button>
                ) : (
                  <span className="text-[10px] font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-md select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Saved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all">
          <div 
            className="card p-6 max-w-sm w-full mx-4 flex flex-col gap-4 border"
            style={{ 
              background: 'var(--bg-surface)', 
              borderColor: 'var(--border)', 
              boxShadow: 'var(--shadow-lg)' 
            }}
          >
            <div>
              <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Delete study session</h3>
              <p className="text-sm" style={{ color: 'var(--text-faint)' }}>
                Are you sure you want to delete this study session from history? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2.5 mt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border hover:opacity-85 transition-all cursor-pointer"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                  background: 'transparent'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteHistoryNote}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-white hover:bg-red-700 transition-colors cursor-pointer hover-shadow-glow"
                style={{
                  background: '#dc2626'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

