// frontend/src/pages/Landing.jsx
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Layers, Video } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Focused Curriculum',
    desc: 'Python, ML, Deep Learning, and Data Science — all in one place.',
  },
  {
    icon: Layers,
    title: 'Structured Learning Paths',
    desc: 'Courses → Modules → Lessons, ordered for progressive mastery.',
  },
  {
    icon: Video,
    title: 'Video-First Lessons',
    desc: 'Embedded YouTube lessons with downloadable resources per lesson.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-base relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 page-container flex items-center justify-between h-20">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center">
            <Brain size={18} className="text-accent" />
          </div>
          <span className="text-xl font-bold tracking-tight">EduFlow</span>
        </div>
        <Link
          to="/login"
          className="flex items-center gap-2 text-sm font-semibold text-accent hover:text-white transition-colors"
        >
          Sign In <ArrowRight size={15} />
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 page-container pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 text-xs font-semibold text-accent mb-8 animate-fade-in">
          Private AI Learning Platform
        </div>
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none mb-6 animate-slide-up">
          Learn AI &<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-orange-300">
            Machine Learning
          </span>
        </h1>
        <p className="text-lg text-muted max-w-xl mx-auto mb-12 animate-slide-up">
          A curated, video-based learning platform covering Python, ML, Deep
          Learning, and Data Science — structured for real progress.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 bg-accent text-white font-bold px-8 py-4 rounded-2xl hover:brightness-110 hover:shadow-glow-lg transition-all duration-300 animate-slide-up text-lg"
        >
          Get Started <ArrowRight size={18} />
        </Link>
      </section>

      {/* Features */}
      <section className="relative z-10 page-container pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card glow-on-hover animate-slide-up">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center mb-4">
                <Icon size={18} className="text-accent" />
              </div>
              <h3 className="font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
