'use client'

import { FileText, Sparkles, MessageSquare, Zap } from 'lucide-react'
import type { ActionType } from '@/types'

const actions: { type: ActionType; icon: React.ElementType; label: string; desc: string; accent: string }[] = [
  { type: 'summarize', icon: FileText,      label: 'Summarize',      desc: 'Get a short summary',            accent: 'rgba(124,58,237,0.1)'  },
  { type: 'quiz',      icon: Sparkles,      label: 'Generate Quiz',  desc: 'Create practice questions',      accent: 'rgba(16,185,129,0.1)'  },
  { type: 'explain',   icon: Zap,           label: 'Explain Simply', desc: "Explain in simple language",     accent: 'rgba(245,158,11,0.1)'  },
  { type: 'chat',      icon: MessageSquare, label: 'Chat with Notes',desc: 'Ask questions about your notes', accent: 'rgba(59,130,246,0.1)'  },
]

const iconColors: Record<ActionType, string> = {
  summarize: '#7c3aed',
  quiz:      '#059669',
  explain:   '#d97706',
  chat:      '#2563eb',
}

interface ActionCardsProps {
  selected: ActionType
  onSelect: (type: ActionType) => void
}

export default function ActionCards({ selected, onSelect }: ActionCardsProps) {
  return (
    <div>
      <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
        What would you like to do?
      </p>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(action => {
          const isSelected = selected === action.type
          return (
            <button
              key={action.type}
              id={`action-${action.type}`}
              onClick={() => onSelect(action.type)}
              className="flex flex-col items-center text-center p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: isSelected ? action.accent : 'var(--bg-surface)',
                border: `1px solid ${isSelected ? iconColors[action.type] + '50' : 'var(--border)'}`,
                boxShadow: isSelected ? `0 4px 12px ${action.accent}` : 'none',
              }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform duration-200"
                style={{ background: action.accent }}>
                <action.icon className="w-5 h-5" style={{ color: iconColors[action.type] }} />
              </div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{action.label}</p>
              <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--text-faint)' }}>{action.desc}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
