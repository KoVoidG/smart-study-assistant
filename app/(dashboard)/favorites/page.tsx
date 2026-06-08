'use client'

import { useState, useEffect } from 'react'
import { Star, FileText } from 'lucide-react'
import { formatDate, getSubjectColor } from '@/lib/utils'
import type { Note } from '@/types'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function FavoritesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/notes?favorites=true')
      .then(r => r.json())
      .then(d => { setNotes(d.notes || []); setLoading(false) })
  }, [])

  const removeFavorite = async (note: Note) => {
    await fetch(`/api/notes/${note.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_favorite: false })
    })
    setNotes(prev => prev.filter(n => n.id !== note.id))
    toast.success('Removed from favorites')
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Favorites</h1>
        <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Your starred notes</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(245, 158, 11, 0.08)' }}>
            <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>No favorites yet</h3>
          <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Star notes in My Notes to see them here</p>
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
                  <button
                    id={`unfav-${note.id}`}
                    onClick={() => removeFavorite(note)}
                    className="icon-btn !w-6 !h-6 z-10"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
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
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{formatDate(note.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

