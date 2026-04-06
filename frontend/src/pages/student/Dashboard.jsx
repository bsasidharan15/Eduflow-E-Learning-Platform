// frontend/src/pages/student/Dashboard.jsx
import { Link } from 'react-router-dom'
import { Brain, ArrowRight, Layers } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import Card from '../../components/ui/Card'

export default function Dashboard() {
  const { user } = useAuthStore()

  return (
    <div className="page-container py-12">
      <div className="mb-12 animate-slide-up">
        <p className="text-muted text-sm mb-1">Welcome back,</p>
        <h1 className="text-4xl font-black tracking-tight">
          {user?.full_name}{' '}
          <span className="text-accent">👋</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
        <Link to="/learn">
          <Card hover className="relative overflow-hidden h-48 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-2xl" />
            <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center">
              <Brain size={22} className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1">AI Learning Hub</h2>
              <p className="text-sm text-muted">
                Browse all courses and continue learning
              </p>
              <div className="flex items-center gap-1 text-accent text-sm font-semibold mt-3">
                Explore courses <ArrowRight size={14} />
              </div>
            </div>
          </Card>
        </Link>

        <Card className="h-48 flex flex-col justify-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4">
            <Layers size={22} className="text-purple-400" />
          </div>
          <h2 className="text-xl font-bold mb-1">Structured Paths</h2>
          <p className="text-sm text-muted leading-relaxed">
            Courses are organised into modules and video lessons. Download
            resources and learn at your own pace.
          </p>
        </Card>
      </div>
    </div>
  )
}
