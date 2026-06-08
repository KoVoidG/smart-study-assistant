'use client'

import { useState, useEffect } from 'react'
import { Search, Star, Trash2, MoreHorizontal, FileText, Filter } from 'lucide-react'
import { formatDate, getSubjectColor, SUBJECTS } from '@/lib/utils'
import type { Note } from '@/types'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function MyNotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (subjectFilter) params.set('subject', subjectFilter)
      const res = await fetch(`/api/notes?${params}`)
      const data = await res.json()
      setNotes(data.notes || [])
      setLoading(false)
    }
    fetchNotes()
  }, [search, subjectFilter])

  const toggleFavorite = async (note: Note) => {
    await fetch(`/api/notes/${note.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_favorite: !note.is_favorite }) })
    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, is_favorite: !n.is_favorite } : n))
    toast.success(note.is_favorite ? 'Removed from favorites' : 'Added to favorites')
  }

  const deleteNote = (id: string) => {
    setDeleteConfirmId(id)
  }

  const confirmDeleteNote = async () => {
    if (!deleteConfirmId) return
    try {
      const id = deleteConfirmId
      setDeleteConfirmId(null)
      await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      setNotes(prev => prev.filter(n => n.id !== id))
      toast.success('Note deleted')
    } catch (err) {
      console.error('Error deleting note:', err)
      toast.error('Failed to delete note')
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    color: 'var(--text-primary)', borderRadius: 12,
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>My Notes</h1>
        <p className="text-sm" style={{ color: 'var(--text-faint)' }}>All your saved study notes in one place</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
          <input id="notes-search" type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search notes..." style={inputStyle}
            className="w-full pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
          <select id="notes-subject-filter" value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}
            style={inputStyle}
            className="w-full sm:w-auto pl-9 pr-8 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 appearance-none cursor-pointer">
            <option value="">All Subjects</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
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
            style={{ background: 'rgba(124,58,237,0.08)' }}>
            <FileText className="w-7 h-7" style={{ color: 'var(--brand)' }} />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>No notes yet</h3>
          <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Start by creating a note on the Dashboard</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(note => (
            <div key={note.id} className="card p-5 hover:-translate-y-0.5 relative group flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className={`px-2 py-0.5 rounded-lg text-xs font-medium ${getSubjectColor(note.subject)}`}>
                    {note.subject || 'General'}
                  </div>
                  <div className="flex items-center gap-1 z-10">
                    <button id={`fav-${note.id}`} onClick={() => toggleFavorite(note)} className="icon-btn !w-6 !h-6">
                      <Star className={`w-3.5 h-3.5 ${note.is_favorite ? 'text-amber-400 fill-amber-400' : ''}`}
                        style={!note.is_favorite ? { color: 'var(--border)' } : {}} />
                    </button>
                    <div className="relative">
                      <button id={`menu-${note.id}`} onClick={() => setOpenMenu(openMenu === note.id ? null : note.id)}
                        className="icon-btn !w-6 !h-6">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                      {openMenu === note.id && (
                        <div className="absolute right-0 top-7 rounded-xl shadow-lg py-1 z-20 min-w-[120px]"
                          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}>
                          <button onClick={() => { deleteNote(note.id); setOpenMenu(null) }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Link href={`/dashboard?noteId=${note.id}`} className="block group/link cursor-pointer">
                  <h3 className="text-sm font-semibold mb-1.5 line-clamp-2 group-hover/link:text-[var(--brand)] transition-colors" style={{ color: 'var(--text-primary)' }}>
                    {note.title.startsWith('__history__') ? note.title.replace('__history__', '') : note.title}
                  </h3>
                  <p className="text-xs line-clamp-3 mb-3 leading-relaxed" style={{ color: 'var(--text-faint)' }}>{note.content}</p>
                </Link>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{formatDate(note.created_at)}</p>
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
              <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Delete study note</h3>
              <p className="text-sm" style={{ color: 'var(--text-faint)' }}>
                Are you sure you want to delete this study note? This action cannot be undone.
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
                onClick={confirmDeleteNote}
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
