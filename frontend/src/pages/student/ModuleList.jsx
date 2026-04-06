// frontend/src/pages/student/ModuleList.jsx
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCourses } from '../../api/courses'
import { getModules } from '../../api/modules'
import { ChevronRight, Layers } from 'lucide-react'

export default function ModuleList() {
  const { courseId } = useParams()

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })
  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => getModules(courseId),
  })

  const course = courses.find((c) => c.id === Number(courseId))

  return (
    <div className="page-container py-12">
      <div className="flex items-center gap-2 text-sm text-muted mb-8 animate-fade-in">
        <Link to="/learn" className="hover:text-white transition-colors">
          AI Learning Hub
        </Link>
        <ChevronRight size={14} />
        <span className="text-white">{course?.name}</span>
      </div>

      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-black tracking-tight">{course?.name}</h1>
        {course?.description && (
          <p className="text-muted mt-2">{course.description}</p>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {modules.map((module, i) => (
            <Link key={module.id} to={`/learn/${courseId}/${module.id}`}>
              <div className="glass-card glow-on-hover flex items-center gap-4 py-5 px-6 animate-slide-up hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                  <Layers size={16} className="text-accent" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted mb-0.5">Module {i + 1}</div>
                  <div className="font-semibold text-white">{module.name}</div>
                </div>
                <ChevronRight size={18} className="text-muted" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
