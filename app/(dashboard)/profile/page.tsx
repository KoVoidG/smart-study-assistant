'use client'

import { useState, useEffect } from 'react'
import { User, Mail, Flame, FileText, Loader2, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import type { Profile } from '@/types'

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [notesCount, setNotesCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email || '')
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (p) { setProfile(p); setFullName(p.full_name || '') }
      const { count } = await supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
      setNotesCount(count || 0)
    }
    load()
  }, [supabase])

  const handleSave = async () => {
    if (!fullName.trim()) { toast.error('Name cannot be empty'); return }
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      // Update DB profile table
      const { error: dbError } = await supabase.from('profiles').update({ full_name: fullName.trim() }).eq('id', user.id)
      if (dbError) throw dbError
      
      // Update Supabase Auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() }
      })
      if (authError) throw authError

      toast.success('Profile updated!')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Profile</h1>
        <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Manage your account information</p>
      </div>

      {/* Avatar + Stats */}
      <div className="card p-6 mb-5">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl font-bold flex-shrink-0"
            style={{ boxShadow: 'var(--shadow-logo)' }}>
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{fullName || 'Set your name'}</h2>
            <p className="text-sm" style={{ color: 'var(--text-faint)' }}>{email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.15)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(251,146,60,0.15)' }}>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{profile?.study_streak || 0}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Day Streak</p>
            </div>
          </div>
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.15)' }}>
              <FileText className="w-5 h-5" style={{ color: 'var(--brand)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{notesCount}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Notes Saved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card p-6">
        <h2 className="text-base font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
              <input
                id="profile-name"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
                placeholder="Your name"
                className="input-token w-full pl-10 pr-4 py-3 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-faint)' }} />
              <input
                type="email"
                value={email}
                disabled
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm cursor-not-allowed"
                style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text-faint)' }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>Email cannot be changed</p>
          </div>
          <button
            id="save-profile"
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 text-white font-semibold rounded-xl text-sm hover-shadow-glow hover:-translate-y-0.5 disabled:opacity-70 transition-all duration-200"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
