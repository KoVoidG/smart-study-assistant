'use client'

import { useState, useRef } from 'react'
import { FileText, Upload, X, Loader2, ClipboardPaste } from 'lucide-react'
import toast from 'react-hot-toast'

interface NoteInputProps {
  value: string
  onChange: (v: string) => void
  onFileUpload: (text: string) => void
}

const MAX_CHARS = 5000

export default function NoteInput({ value, onChange, onFileUpload }: NoteInputProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = async (file: File) => {
    if (!file) return
    setUploading(true)
    const uploadToast = toast.loading('Processing file...')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`)
      if (data.text?.trim()) {
        onFileUpload(data.text.slice(0, MAX_CHARS))
        toast.success(data.text.length > MAX_CHARS
          ? `File loaded! (first ${MAX_CHARS.toLocaleString()} chars)`
          : 'File loaded successfully!', { id: uploadToast })
      } else {
        toast.error('No text could be extracted. Try pasting the text instead.', { id: uploadToast })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to process file.'
      toast.error(msg, { id: uploadToast })
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handlePaste = async () => {
    if (navigator.clipboard?.readText) {
      try {
        const text = await navigator.clipboard.readText()
        if (text.trim()) { onChange(text.slice(0, MAX_CHARS)); toast.success('Pasted from clipboard!') }
        else toast('Clipboard is empty — copy some text first.', { icon: '📋' })
        return
      } catch { /* permission denied, fall through */ }
    }
    const textarea = document.getElementById('notes-textarea') as HTMLTextAreaElement | null
    if (textarea) {
      textarea.focus()
      toast('Press Ctrl+V (or Cmd+V) inside the text area to paste.', { icon: '📋', duration: 4000 })
    }
  }

  return (
    <div
      className="card flex flex-col h-full"
      style={dragOver ? { borderColor: 'var(--brand)', background: 'rgba(124,58,237,0.04)' } : {}}
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" style={{ color: 'var(--brand)' }} />
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Your Notes</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="paste-text-btn"
            onClick={handlePaste}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--brand)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <ClipboardPaste className="w-3 h-3" />
            <span className="hidden sm:inline">Paste Text</span>
            <span className="sm:hidden">Paste</span>
          </button>
          <button
            id="upload-file-btn"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg hover-shadow-glow disabled:opacity-70 transition-all"
          >
            {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
            <span className="hidden sm:inline">Upload File</span>
            <span className="sm:hidden">Upload</span>
          </button>
          <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
        </div>
      </div>

      {/* Textarea */}
      <div className="relative flex-1 min-h-[200px] lg:min-h-0">
        <textarea
          id="notes-textarea"
          value={value}
          onChange={e => onChange(e.target.value.slice(0, MAX_CHARS))}
          placeholder={dragOver ? 'Drop your file here...' : 'Paste or type your study notes here...'}
          className="w-full h-full min-h-[200px] lg:min-h-0 px-4 md:px-5 py-4 text-sm resize-none focus:outline-none bg-transparent leading-relaxed"
          style={{ color: 'var(--text-secondary)', caretColor: 'var(--brand)' }}
        />
        {value && (
          <button onClick={() => onChange('')}
            className="absolute top-3 right-3 p-1 rounded-lg transition-colors icon-btn !w-6 !h-6">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 md:px-5 py-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: value.length > MAX_CHARS * 0.9 ? '#f59e0b' : 'var(--text-faint)' }}>
            {value.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters
          </span>
          {dragOver && <span className="text-xs font-medium animate-pulse" style={{ color: 'var(--brand)' }}>Drop file here ↓</span>}
        </div>
      </div>
    </div>
  )
}
