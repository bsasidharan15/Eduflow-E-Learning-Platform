// frontend/src/layouts/AdminLayout.jsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, Users, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
  { to: '/admin/students', icon: Users, label: 'Students' },
]

export default function AdminLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-base flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-surface border-r border-white/[0.06] flex flex-col">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <BookOpen size={16} className="text-accent" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight">EduFlow</div>
              <div className="text-xs text-muted">Admin Panel</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-accent/15 text-accent border border-accent/20'
                    : 'text-muted hover:text-white hover:bg-elevated'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/[0.06]">
          <div className="text-xs text-muted mb-2 truncate">{user?.email}</div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted hover:text-white transition-colors"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
