import Link from 'next/link'
import { BookOpen, Sparkles, Brain, Zap, MessageSquare, FileText, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-violet-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-base sm:text-lg font-bold text-slate-900">Smart Study Assistant</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-violet-700 transition-colors px-3 sm:px-4 py-2 rounded-xl hover:bg-violet-50">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 px-4 sm:px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-violet-200 hover:-translate-y-0.5 transition-all duration-200">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 sm:px-6 pt-16 sm:pt-24 pb-0 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs sm:text-sm font-medium px-4 py-2 rounded-full mb-6 sm:mb-8">
            <Sparkles className="w-4 h-4" />
            AI-Powered Study Tool — Free for Every Student
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-5 sm:mb-6">
            Study Smarter with<br />
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              AI-Powered Insights
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-500 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            Transform your notes into summaries, quizzes, and simplified explanations.
            Chat with your notes and supercharge your learning — completely free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
            <Link href="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 rounded-2xl hover:shadow-xl hover:shadow-violet-200 hover:-translate-y-1 transition-all duration-200">
              Start Studying Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="w-full sm:w-auto text-base font-medium text-slate-700 bg-white px-8 py-4 rounded-2xl border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all duration-200 text-center">
              Sign In
            </Link>
          </div>
          <p className="text-sm text-slate-400">No credit card required · Free for every student</p>
        </div>

        {/* Hero Preview — Edge to edge */}
        <div className="mt-12 sm:mt-16 w-full relative">
          {/* Fade gradient at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />
          <div className="bg-white border-t border-x-0 border-violet-100 shadow-2xl shadow-violet-100/50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Fake note input */}
                <div className="flex-1 bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4 text-violet-500" />
                    <span className="text-sm font-semibold text-slate-700">Your Notes</span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Photosynthesis is the process used by plants, algae, and certain bacteria to convert light energy into chemical energy...
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
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
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Everything You Need to Ace Your Studies</h2>
          <p className="text-base sm:text-lg text-slate-500">Four powerful AI tools built into one seamless experience</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {[
            { icon: FileText, title: 'Summarize', desc: 'Get concise summaries and key points from any text', color: 'from-violet-500 to-purple-600' },
            { icon: Brain, title: 'Generate Quiz', desc: 'Create practice questions to test your knowledge', color: 'from-blue-500 to-indigo-600' },
            { icon: Zap, title: 'Explain Simply', desc: "Complex topics explained in plain, simple language", color: 'from-amber-500 to-orange-600' },
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

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl shadow-violet-200">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-3 sm:mb-4">Start Learning Smarter Today</h2>
          <p className="text-violet-200 text-sm sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto">
            Completely free for every student. No credit card needed. Just sign up and start studying.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-4 rounded-2xl hover:bg-violet-50 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-700">Smart Study Assistant</span>
          </div>
          <p className="text-sm text-slate-400 text-center">
            Free and open for every student to make learning accessible.
          </p>
        </div>
      </footer>
    </div>
  )
}
