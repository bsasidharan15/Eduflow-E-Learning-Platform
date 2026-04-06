// frontend/src/pages/admin/AdminDashboard.jsx
import { Link } from 'react-router-dom'
import { BookOpen, Users, ArrowRight, LayoutGrid } from 'lucide-react'
import Card from '../../components/ui/Card'

const panels = [
  {
    to: '/admin/courses',
    icon: BookOpen,
    label: 'Manage Courses',
    desc: 'Add, edit, delete, and reorder top-level courses',
    color: 'text-orange-400',
    bg: 'bg-orange-500/15',
  },
  {
    to: '/admin/courses',
    icon: LayoutGrid,
    label: 'Manage Modules & Lessons',
    desc: 'Drill into a course to manage its modules and video lessons',
    color: 'text-violet-400',
    bg: 'bg-violet-500/15',
  },
  {
    to: '/admin/students',
    icon: Users,
    label: 'Manage Students',
    desc: 'Create and manage student accounts',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
  },
]

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-10 animate-slide-up">
        <h1 className="text-4xl font-black tracking-tight">Admin Dashboard</h1>
        <p className="text-muted mt-2">Manage your EduFlow platform</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {panels.map(({ to, icon: Icon, label, desc, color, bg }) => (
          <Link key={label} to={to}>
            <Card hover className="flex gap-4 items-start animate-slide-up">
              <div
                className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0 mt-0.5`}
              >
                <Icon size={20} className={color} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{label}</h3>
                  <ArrowRight size={16} className="text-muted" />
                </div>
                <p className="text-sm text-muted mt-1 leading-relaxed">{desc}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
