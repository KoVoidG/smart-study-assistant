import Link from 'next/link'
import { BookOpen, Sparkles, Brain, Zap, MessageSquare, FileText, ArrowRight, Check } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-violet-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">Smart Study Assistant</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-violet-700 transition-colors px-4 py-2 rounded-xl hover:bg-violet-50">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5 transition-all duration-200">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-sm font-medium px-4 py-2 rounded-full mb-8">
          <Sparkles className="w-4 h-4" />
          AI-Powered Study Tool
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900 leading-tight mb-6">
          Study Smarter with<br />
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            AI-Powered Insights
          </span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Transform your notes into summaries, quizzes, and simplified explanations. Chat with your notes and supercharge your learning.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/signup" className="flex items-center gap-2 text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 rounded-2xl hover:shadow-xl hover:shadow-violet-200 hover:-translate-y-1 transition-all duration-200">
            Start Studying Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="text-base font-medium text-slate-700 bg-white px-8 py-4 rounded-2xl border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all duration-200">
            Sign In
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-400">No credit card required · Free to get started</p>

        {/* Hero Preview */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50 z-10 rounded-3xl" />
          <div className="bg-white rounded-3xl shadow-2xl shadow-violet-100 border border-violet-100 overflow-hidden p-6">
            <div className="flex gap-4">
              {/* Fake note input */}
              <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-semibold text-slate-700">Your Notes</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Photosynthesis is the process used by plants, algae, and certain bacteria to convert light energy into chemical energy...
                </p>
                <div className="mt-4 flex gap-2">
                  {['Summarize', 'Generate Quiz', 'Explain Simply', 'Chat'].map((action, i) => (
                    <div key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i === 0 ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                      {action}
                    </div>
                  ))}
                </div>
              </div>
              {/* Fake AI result */}
              <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <span className="text-sm font-semibold text-slate-700">AI Result</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Photosynthesis is how plants turn light into food. They use sunlight, CO₂, and water to create glucose and oxygen...
                </p>
                <div className="mt-4 space-y-2">
                  {['Uses light energy', 'Produces oxygen', 'Occurs in chloroplasts'].map((point, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything You Need to Ace Your Studies</h2>
          <p className="text-lg text-slate-500">Four powerful AI tools built into one seamless experience</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: FileText, title: 'Summarize', desc: 'Get concise summaries and key points from any text', color: 'from-violet-500 to-purple-600' },
            { icon: Brain, title: 'Generate Quiz', desc: 'Create practice questions to test your knowledge', color: 'from-blue-500 to-indigo-600' },
            { icon: Zap, title: 'Explain Simply', desc: "Complex topics explained like you're 5 years old", color: 'from-amber-500 to-orange-600' },
            { icon: MessageSquare, title: 'Chat with Notes', desc: 'Ask anything about your notes and get instant answers', color: 'from-emerald-500 to-teal-600' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-300 group">
              <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-slate-500">Start free, upgrade when you need more</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {[
            {
              name: 'Free', price: '$0', period: 'forever',
              features: ['50 AI generations/month', 'Summarize & Quiz', 'Save up to 20 notes', 'Study streak tracking'],
              cta: 'Get Started', highlight: false
            },
            {
              name: 'Pro', price: '$9', period: '/month',
              features: ['Unlimited AI generations', 'All 4 AI features', 'Unlimited notes', 'File upload (PDF)', 'Priority AI responses'],
              cta: 'Start Pro', highlight: true
            }
          ].map((plan, i) => (
            <div key={i} className={`rounded-3xl p-8 ${plan.highlight ? 'bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-2xl shadow-violet-200 scale-105' : 'bg-white border border-slate-200'}`}>
              <h3 className={`text-lg font-semibold mb-1 ${plan.highlight ? 'text-violet-200' : 'text-slate-500'}`}>{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className={`text-sm ${plan.highlight ? 'text-violet-200' : 'text-slate-400'}`}>{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm">
                    <Check className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-violet-200' : 'text-violet-500'}`} />
                    <span className={plan.highlight ? 'text-violet-100' : 'text-slate-600'}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${plan.highlight ? 'bg-white text-violet-700 hover:bg-violet-50' : 'bg-violet-600 text-white hover:bg-violet-700'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-700">Smart Study Assistant</span>
          </div>
          <p className="text-sm text-slate-400">© 2025 Smart Study Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
