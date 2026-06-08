import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/layout/DashboardShell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch profile (streak + name)
  const { data: profile } = await supabase
    .from('profiles')
    .select('study_streak, full_name')
    .eq('id', user.id)
    .single()

  const displayName = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const streak = profile?.study_streak ?? 0

  return (
    <DashboardShell userName={displayName} streak={streak} user={user}>
      {children}
    </DashboardShell>
  )
}
