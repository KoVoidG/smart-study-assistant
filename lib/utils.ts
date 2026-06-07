export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const SUBJECT_COLORS: Record<string, string> = {
  Biology: 'bg-emerald-100 text-emerald-700',
  Physics: 'bg-blue-100 text-blue-700',
  Chemistry: 'bg-amber-100 text-amber-700',
  Mathematics: 'bg-violet-100 text-violet-700',
  'Computer Science': 'bg-cyan-100 text-cyan-700',
  History: 'bg-orange-100 text-orange-700',
  Literature: 'bg-pink-100 text-pink-700',
  Economics: 'bg-teal-100 text-teal-700',
  Other: 'bg-slate-100 text-slate-700',
}

export function getSubjectColor(subject: string | null): string {
  if (!subject) return SUBJECT_COLORS['Other']
  return SUBJECT_COLORS[subject] || SUBJECT_COLORS['Other']
}

export const SUBJECTS = Object.keys(SUBJECT_COLORS)
