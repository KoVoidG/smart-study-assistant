'use client'

import { useState, useRef, useEffect } from 'react'
import { Copy, Download, ThumbsUp, ThumbsDown, Sparkles, Loader2, Send } from 'lucide-react'
import type { ActionType, SummaryResult, QuizResult, ExplanationResult, ChatMessage } from '@/types'
import toast from 'react-hot-toast'

type TabType = 'summary' | 'quiz' | 'explanation' | 'chat'

interface AIResultPanelProps {
  activeAction: ActionType
  loading: boolean
  summaryResult: SummaryResult | null
  quizResult: QuizResult | null
  explanationResult: ExplanationResult | null
  chatMessages: ChatMessage[]
  onChat: (message: string) => void
  chatLoading: boolean
}

export default function AIResultPanel({
  activeAction, loading, summaryResult, quizResult, explanationResult, chatMessages, onChat, chatLoading
}: AIResultPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('summary')
  const [chatInput, setChatInput] = useState('')
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({})
  const [typedAnswers, setTypedAnswers] = useState<Record<number, string>>({})

  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeTab === 'chat' && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [chatMessages, chatLoading, activeTab])

  const [prevActiveAction, setPrevActiveAction] = useState(activeAction)
  if (activeAction !== prevActiveAction) {
    setPrevActiveAction(activeAction)
    setActiveTab(activeAction as TabType)
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'summary',     label: 'Summary'  },
    { id: 'quiz',        label: 'Quiz'     },
    { id: 'explanation', label: 'Explain'  },
    { id: 'chat',        label: 'Chat'     },
  ]

  const getContent = () => {
    if (activeTab === 'summary')     return summaryResult?.summary || ''
    if (activeTab === 'explanation') return explanationResult?.explanation || ''
    return ''
  }

  const handleCopy = () => {
    const text = getContent()
    if (text) { navigator.clipboard.writeText(text); toast.success('Copied!') }
    else toast.error('No content to copy yet')
  }

  const handleDownload = () => {
    const text = getContent()
    if (!text) { toast.error('No content to download yet'); return }
    const blob = new Blob([text], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${activeTab}-result.txt`
    a.click()
  }

  const handleSendChat = () => {
    if (!chatInput.trim()) return
    onChat(chatInput.trim())
    setChatInput('')
  }

  const btnBase: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 12px', fontSize: 12, fontWeight: 500,
    borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
    color: 'var(--text-muted)', border: '1px solid var(--border)',
    background: 'transparent',
  }

  return (
    <div className="card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: 'var(--brand)' }} />
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>AI Result</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button id="copy-result" onClick={handleCopy} style={btnBase}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--brand)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <Copy className="w-3 h-3" /><span className="hidden sm:inline">Copy</span>
          </button>
          <button id="download-result" onClick={handleDownload} style={btnBase}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--brand)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
            <Download className="w-3 h-3" /><span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center overflow-x-auto" style={{ borderBottom: '1px solid var(--border-subtle)', padding: '0 16px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            id={`result-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className="py-3 px-4 text-sm font-medium border-b-2 -mb-px transition-all whitespace-nowrap"
            style={{
              borderBottomColor: activeTab === tab.id ? 'var(--brand)' : 'transparent',
              color: activeTab === tab.id ? 'var(--brand)' : 'var(--text-faint)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0 p-4 md:p-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full flex-1 gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.1)' }}>
              <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--brand)' }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>AI is analyzing your notes...</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>This usually takes a few seconds</p>
            </div>
            <div className="w-full max-w-xs space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-3 rounded" style={{ width: `${100 - i * 10}%` }} />)}
            </div>
          </div>
        ) : (
          <>
            {/* Summary */}
            {activeTab === 'summary' && (
              <div className="animate-fade-in flex flex-col h-full flex-1 min-h-0">
                {summaryResult ? (
                  <div className="space-y-4 overflow-y-auto flex-1 pr-1">
                    <div className="rounded-xl p-4" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{summaryResult.summary}</p>
                    </div>
                    {summaryResult.keyPoints.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Key Points</h3>
                        <ul className="space-y-2">
                          {summaryResult.keyPoints.map((point, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                              <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--brand)' }} />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-faint)' }}>Was this summary helpful?</p>
                      <div className="flex gap-2">
                        <button id="helpful-up" className="icon-btn !w-7 !h-7"><ThumbsUp className="w-3.5 h-3.5" /></button>
                        <button id="helpful-down" className="icon-btn !w-7 !h-7"><ThumbsDown className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <EmptyState text="Generate a summary to see the result here" />
                )}
              </div>
            )}

            {/* Quiz */}
            {/* Quiz */}
            {activeTab === 'quiz' && (
              <div className="animate-fade-in flex flex-col h-full flex-1 min-h-0">
                {quizResult ? (
                  <div className="space-y-5 overflow-y-auto flex-1 pr-1">
                    {quizResult.questions.map((q, i) => (
                      <div key={i} className="rounded-xl p-4" style={{ border: '1px solid var(--border)' }}>
                        <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                          <span style={{ color: 'var(--brand)' }}>Q{i + 1}.</span> {q.question}
                        </p>
                        {q.type === 'multiple_choice' && q.options ? (
                          <div className="space-y-2">
                            {q.options.map((opt, j) => {
                              const selected = selectedAnswers[i] === opt
                              const revealed = revealedAnswers[i]
                              let bg = 'transparent', borderColor = 'var(--border)', color = 'var(--text-secondary)'
                              if (selected) {
                                if (revealed) {
                                  bg = opt === q.answer ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)'
                                  borderColor = opt === q.answer ? '#10b981' : '#ef4444'
                                  color = opt === q.answer ? '#059669' : '#dc2626'
                                } else {
                                  bg = 'rgba(124,58,237,0.08)'
                                  borderColor = 'var(--brand)'
                                  color = 'var(--brand)'
                                }
                              }
                              return (
                                <button key={j} id={`quiz-${i}-opt-${j}`}
                                  onClick={() => setSelectedAnswers(prev => ({ ...prev, [i]: opt }))}
                                  className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
                                  style={{ background: bg, border: `1px solid ${borderColor}`, color }}>
                                  {opt}
                                </button>
                              )
                            })}
                            <button id={`quiz-${i}-reveal`}
                              onClick={() => setRevealedAnswers(prev => ({ ...prev, [i]: true }))}
                              className="text-xs font-medium mt-1 hover:opacity-70 transition-opacity"
                              style={{ color: 'var(--brand)' }}>
                              {revealedAnswers[i] ? `✓ Answer: ${q.answer}` : 'Reveal Answer'}
                            </button>
                          </div>
                        ) : (
                          <div className="rounded-xl p-3.5 space-y-3" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Type your answer:</p>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Type short answer here..."
                                value={typedAnswers[i] || ''}
                                disabled={revealedAnswers[i]}
                                onChange={e => setTypedAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                                onKeyDown={e => {
                                  if (e.key === 'Enter' && !revealedAnswers[i]) {
                                    setRevealedAnswers(prev => ({ ...prev, [i]: true }))
                                  }
                                }}
                                className="input-token flex-1 px-3 py-1.5 text-sm"
                                style={{ background: 'var(--bg-surface)' }}
                              />
                              <button
                                id={`quiz-check-${i}`}
                                disabled={revealedAnswers[i] || !(typedAnswers[i]?.trim())}
                                onClick={() => setRevealedAnswers(prev => ({ ...prev, [i]: true }))}
                                className="px-4 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium rounded-xl text-xs hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                              >
                                Check
                              </button>
                            </div>
                            {revealedAnswers[i] && (
                              <div className="pt-2 animate-fade-in" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
                                  Your Answer: <span className="font-semibold" style={{ color: (typedAnswers[i]?.trim().toLowerCase() === q.answer.trim().toLowerCase()) ? '#10b981' : '#ef4444' }}>{typedAnswers[i] || '(empty)'}</span>
                                </p>
                                <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>
                                  Correct Answer: <span className="font-semibold" style={{ color: 'var(--brand)' }}>{q.answer}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState text="Generate a quiz to see practice questions here" />
                )}
              </div>
            )}

            {/* Explanation */}
            {activeTab === 'explanation' && (
              <div className="animate-fade-in flex flex-col h-full flex-1 min-h-0">
                {explanationResult ? (
                  <div className="overflow-y-auto flex-1 pr-1">
                    <div className="rounded-xl p-5" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">💡</span>
                        <p className="text-sm font-semibold" style={{ color: '#92400e' }}>Simple Explanation</p>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#78350f' }}>{explanationResult.explanation}</p>
                    </div>
                  </div>
                ) : (
                  <EmptyState text="Generate an explanation to see simplified content here" />
                )}
              </div>
            )}

            {/* Chat */}
            {activeTab === 'chat' && (
              <div className="animate-fade-in flex flex-col flex-1 min-h-0 h-full justify-between">
                <div ref={chatContainerRef} className="flex-1 space-y-3 mb-4 overflow-y-auto pr-1 flex flex-col">
                  {chatMessages.length === 0
                    ? <EmptyState text="Ask a question about your notes to start chatting" />
                    : chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                          style={msg.role === 'user'
                            ? { background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: 'white', borderBottomRightRadius: 4 }
                            : { background: 'var(--bg-subtle)', color: 'var(--text-secondary)', borderBottomLeftRadius: 4 }}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="px-4 py-3 rounded-2xl flex gap-1.5" style={{ background: 'var(--bg-subtle)', borderBottomLeftRadius: 4 }}>
                        {[0, 1, 2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full"
                            style={{ background: 'var(--text-faint)', animation: `bounceDot 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <input
                    id="chat-input"
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSendChat() }}
                    placeholder="Ask a question about your notes..."
                    className="flex-1 px-4 py-2.5 text-sm rounded-xl focus:outline-none transition-all"
                    style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--brand)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                  />
                  <button
                    id="chat-send"
                    onClick={handleSendChat}
                    disabled={!chatInput.trim() || chatLoading}
                    className="w-10 h-10 flex items-center justify-center text-white rounded-xl hover-shadow-glow disabled:opacity-50 transition-all flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full flex-1 py-12 text-center">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
        style={{ background: 'var(--bg-subtle)' }}>
        <Sparkles className="w-5 h-5" style={{ color: 'var(--border)' }} />
      </div>
      <p className="text-sm max-w-sm" style={{ color: 'var(--text-faint)' }}>{text}</p>
    </div>
  )
}
