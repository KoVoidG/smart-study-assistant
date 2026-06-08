'use client'

import Link from 'next/link'
import { MoreHorizontal, Star } from 'lucide-react'
import { formatDate, getSubjectColor } from '@/lib/utils'
import type { Note } from '@/types'

interface RecentNotesProps {
  notes: Note[]
}

export default function RecentNotes({ notes }: RecentNotesProps) {
  if (notes.length === 0) return null

  return (
    <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-subtle)' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Notes</h2>
        <Link href="/history" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: 'var(--brand)' }}>
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {notes.map(note => {
          const isHistory = note.title.startsWith('__history__')
          const displayTitle = isHistory ? note.title.replace('__history__', '') : note.title
          return (
            <Link key={note.id} href={`/dashboard?noteId=${note.id}`}>
              <div className="card p-4 hover:-translate-y-0.5 group cursor-pointer flex flex-col justify-between min-h-[120px]">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`px-2 py-0.5 rounded-lg text-xs font-medium ${getSubjectColor(isHistory ? note.subject : note.subject)}`}>
                      {note.subject || 'General'}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {note.is_favorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      <button id={`note-menu-${note.id}`} onClick={e => e.preventDefault()}
                        className="icon-btn !w-5 !h-5">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold mb-1 truncate" style={{ color: 'var(--text-primary)' }}>{displayTitle}</h3>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>{formatDate(note.created_at)}</span>
                  {isHistory ? (
                    <span className="text-[10px] font-semibold flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      History
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Saved
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
