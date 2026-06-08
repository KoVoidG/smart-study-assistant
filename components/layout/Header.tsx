'use client'

import { useEffect, useRef, useState } from 'react'
import { Bell, Sun, Moon, Menu, X, CheckCheck } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

interface HeaderProps {
  userName: string
  onMenuToggle?: () => void
  menuOpen?: boolean
}

const NOTIFICATIONS = [
  { id: 1, title: 'Daily study reminder', desc: 'Time to keep your streak going! 🔥', time: 'Now', unread: true },
  { id: 2, title: 'New feature available', desc: 'Try the Chat with Notes feature!', time: '2h ago', unread: true },
  { id: 3, title: 'Note saved', desc: 'Your notes were saved successfully.', time: 'Yesterday', unread: false },
]

export default function Header({ userName, onMenuToggle, menuOpen }: HeaderProps) {
  const { theme, toggle } = useTheme()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = userName.split(' ')[0]

  const [showNotif, setShowNotif] = useState(false)
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const notifRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => n.unread).length

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))

  return (
    <header className="header-bg h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-3">
        <button
          id="header-menu-toggle"
          onClick={onMenuToggle}
          className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors md:hidden hover:bg-[var(--bg-subtle)] hover:text-[var(--brand)]"
          style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
          title={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div>
          <h1 className="text-base md:text-xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
            {greeting}, {firstName}! <span>👋</span>
          </h1>
          <p className="text-xs md:text-sm" style={{ color: 'var(--text-faint)' }}>
            What would you like to learn today?
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          id="header-theme-toggle"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={toggle}
          className="icon-btn"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            id="header-notifications"
            title="Notifications"
            onClick={() => setShowNotif(prev => !prev)}
            className="icon-btn relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && <span className="notif-dot animate-pulse-soft" />}
          </button>

          {showNotif && (
            <div className="animate-slide-down absolute right-0 top-12 w-80 rounded-2xl z-50 overflow-hidden"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" style={{ color: 'var(--brand)' }} />
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(124,58,237,0.12)', color: 'var(--brand)' }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead}
                    className="flex items-center gap-1 text-xs font-medium hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--brand)' }}>
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto">
                {notifications.map(notif => (
                  <div key={notif.id}
                    onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n))}
                    className="px-4 py-3 cursor-pointer transition-colors"
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: notif.unread ? 'rgba(124,58,237,0.05)' : 'transparent',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-subtle)')}
                    onMouseLeave={e => (e.currentTarget.style.background = notif.unread ? 'rgba(124,58,237,0.05)' : 'transparent')}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                        style={{ background: notif.unread ? 'var(--brand)' : 'transparent' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{notif.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-faint)' }}>{notif.desc}</p>
                      </div>
                      <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-faint)' }}>{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 text-center" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <button className="text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: 'var(--brand)' }}>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
