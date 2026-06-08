'use client'

import { useState } from 'react'
import { Bell, Shield, Trash2, Moon, Sun, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/providers/ThemeProvider'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const supabase = createClient()
  const router = useRouter()
  const { theme, toggle } = useTheme()

  const [studyReminder, setStudyReminder] = useState(true)
  const [streakAlert, setStreakAlert] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleDeleteAccountClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!deletePassword.trim()) {
      toast.error('Please enter your password')
      return
    }

    setDeleteLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !user.email) {
        throw new Error('User email not found')
      }

      // Re-authenticate user to verify their password
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: deletePassword
      })

      if (signInErr) {
        toast.error('Incorrect password. Please try again.')
        setDeleteLoading(false)
        return
      }

      // Call the database function to self-delete securely via RPC
      const { error: deleteErr } = await supabase.rpc('delete_user')
      if (deleteErr) {
        throw new Error(deleteErr.message || 'Database function delete_user is missing. Please run schema.sql first.')
      }

      // Sign out and route back to login
      await supabase.auth.signOut()
      toast.success('Your account has been successfully deleted.')
      router.push('/login')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete account')
      console.error(err)
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out successfully')
    router.push('/login')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Manage your preferences</p>
      </div>

      <div className="space-y-5">
        {/* Appearance */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.1)' }}>
              {theme === 'dark' ? <Sun className="w-4 h-4" style={{ color: 'var(--brand)' }} /> : <Moon className="w-4 h-4" style={{ color: 'var(--brand)' }} />}
            </div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Appearance</h2>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Dark Mode</p>
              <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Switch between light and dark theme</p>
            </div>
            <button
              id="settings-dark-mode"
              onClick={toggle}
              className="toggle-track"
              style={{ background: theme === 'dark' ? 'var(--brand)' : 'var(--border)' }}
              aria-label="Toggle dark mode"
            >
              <div className="toggle-thumb" style={{ transform: theme === 'dark' ? 'translateX(20px)' : 'translateX(0)' }} />
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <Bell className="w-4 h-4 text-blue-500" />
            </div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { id: 'notif-study',  label: 'Study Reminders', desc: 'Get reminded to study every day', checked: studyReminder, onChange: () => setStudyReminder(!studyReminder) },
              { id: 'notif-streak', label: 'Streak Alerts',   desc: 'Notify when your streak is about to break', checked: streakAlert, onChange: () => setStreakAlert(!streakAlert) },
            ].map(item => (
              <div key={item.id} className="flex items-center justify-between py-3"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{item.desc}</p>
                </div>
                <button
                  id={item.id}
                  onClick={item.onChange}
                  className="toggle-track"
                  style={{ background: item.checked ? 'var(--brand)' : 'var(--border)' }}
                  aria-label={`Toggle ${item.label}`}
                >
                  <div className="toggle-thumb" style={{ transform: item.checked ? 'translateX(20px)' : 'translateX(0)' }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.1)' }}>
              <Shield className="w-4 h-4" style={{ color: 'var(--brand)' }} />
            </div>
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Account</h2>
          </div>
          <div className="space-y-3">
            <button id="settings-logout" onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              Sign Out
            </button>
            <button id="settings-delete-account" onClick={handleDeleteAccountClick}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors"
              style={{ border: '1px solid rgba(239,68,68,0.3)', color: '#dc2626', background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.05)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <Trash2 className="w-4 h-4" /> Delete Account
            </button>
          </div>
        </div>

        {/* About */}
        <div className="card p-6">
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>About</h2>
          <div className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <p>Smart Study Assistant v1.0.0</p>
            <p>Built with Next.js, Supabase &amp; OpenAI</p>
            <p className="text-xs mt-3" style={{ color: 'var(--text-faint)' }}>
              Free and open for every student. © 2026 Smart Study Assistant.
            </p>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all animate-fade-in">
          <form 
            onSubmit={handleDeleteAccount}
            className="card p-6 max-w-sm w-full mx-4 flex flex-col gap-4 border"
            style={{ 
              background: 'var(--bg-surface)', 
              borderColor: 'var(--border)', 
              boxShadow: 'var(--shadow-lg)' 
            }}
          >
            <div>
              <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>Delete Account</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-faint)' }}>
                This will permanently delete your account and all your study notes. Please enter your password to confirm.
              </p>
              
              <div className="relative">
                <input
                  type="password"
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                  style={{
                    background: 'var(--bg-subtle)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-2.5 mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletePassword('')
                }}
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
                type="submit"
                disabled={deleteLoading}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-white hover:bg-red-700 transition-colors cursor-pointer hover-shadow-glow flex items-center gap-1.5"
                style={{
                  background: '#dc2626'
                }}
              >
                {deleteLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

