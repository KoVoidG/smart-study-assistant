'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

interface DashboardShellProps {
  children: React.ReactNode
  userName: string
  streak: number
  user: { id: string; email?: string; user_metadata?: { full_name?: string } } | null
}

export default function DashboardShell({ children, userName, streak, user }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[var(--bg-base)] transition-colors duration-300">
      <Sidebar
        user={user}
        streak={streak}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <Header
          userName={userName}
          onMenuToggle={() => setMobileMenuOpen(prev => !prev)}
          menuOpen={mobileMenuOpen}
        />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
