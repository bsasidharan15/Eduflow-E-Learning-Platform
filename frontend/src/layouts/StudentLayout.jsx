// frontend/src/layouts/StudentLayout.jsx
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { LogOut, BookOpen } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function StudentLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-base">
      <nav className="sticky top-0 z-40 bg-base/80 backdrop-blur-md border-b border-white/[0.06]">
        <div className="page-container flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <BookOpen size={16} className="text-accent" />
            </div>
            <span className="font-bold text-lg tracking-tight">EduFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted hidden sm:block">
              {user?.full_name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </nav>
      <main className="animate-fade-in">
        <Outlet />
      </main>
    </div>
  )
}
