'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, LayoutDashboard, FileText, Clock, Star, User, Settings, LogOut, Flame, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'My Notes', href: '/my-notes' },
  { icon: Clock, label: 'History', href: '/history' },
  { icon: Star, label: 'Favorites', href: '/favorites' },
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

interface SidebarProps {
  user: { id: string; email?: string; user_metadata?: { full_name?: string } } | null
  streak: number
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ user, streak, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/login')
    router.refresh()
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const streakProgress = Math.min((streak % 30) / 30 * 100, 100)

  const renderSidebarContent = () => (
    <aside className="sidebar-bg h-full w-60 flex flex-col transition-colors duration-250"
      style={{ borderRight: '1px solid var(--border-subtle)' }}>
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ boxShadow: 'var(--shadow-logo)' }}>
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Smart Study</p>
            <p className="text-xs font-medium" style={{ color: 'var(--brand)' }}>Assistant</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors md:hidden hover:bg-[var(--bg-subtle)] hover:text-[var(--brand)]"
            style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-0.5">
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`nav-link ${active ? 'active' : ''}`}
                >
                  <item.icon className={`w-4 h-4 flex-shrink-0 nav-icon ${active ? 'active' : ''}`} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Study Streak */}
      <div className="mx-3 mb-3 p-4 rounded-2xl"
        style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.15)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Study Streak</span>
        </div>
        <p className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>{streak} days</p>
        <p className="text-xs text-orange-500 font-medium mb-3">Keep going!</p>
        <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: 'rgba(251,146,60,0.2)' }}>
          <div className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${streakProgress}%` }} />
        </div>
      </div>

      {/* User Profile */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl transition-colors group cursor-pointer"
          style={{ transition: 'background-color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{displayName}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-faint)' }}>{user?.email}</p>
          </div>
          <button
            id="sidebar-logout"
            onClick={handleLogout}
            title="Sign out"
            className="icon-btn opacity-0 group-hover:opacity-100 !w-7 !h-7"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen z-40">
        {renderSidebarContent()}
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex" onClick={onClose}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-50 h-full animate-slide-in" onClick={e => e.stopPropagation()}>
            {renderSidebarContent()}
          </div>
        </div>
      )}
    </>
  )
}
