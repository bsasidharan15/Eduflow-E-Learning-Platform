// frontend/src/pages/student/LessonList.jsx
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCourses } from '../../api/courses'
import { getModules } from '../../api/modules'
import { getLessons } from '../../api/lessons'
import { ChevronRight, Play, FileText } from 'lucide-react'

export default function LessonList() {
  const { courseId, moduleId } = useParams()

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })
  const { data: modules = [] } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => getModules(courseId),
  })
  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: () => getLessons(moduleId),
  })

  const course = courses.find((c) => c.id === Number(courseId))
  const module = modules.find((m) => m.id === Number(moduleId))

  return (
    <div className="page-container py-12">
      <div className="flex items-center gap-2 text-sm text-muted mb-8 animate-fade-in flex-wrap">
        <Link to="/learn" className="hover:text-white transition-colors">
          AI Learning Hub
        </Link>
        <ChevronRight size={14} />
        <Link
          to={`/learn/${courseId}`}
          className="hover:text-white transition-colors"
        >
          {course?.name}
        </Link>
        <ChevronRight size={14} />
        <span className="text-white">{module?.name}</span>
      </div>

      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-black tracking-tight">{module?.name}</h1>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, i) => (
            <Link key={lesson.id} to={`/learn/lesson/${lesson.id}`}>
              <div className="glass-card glow-on-hover flex items-center gap-4 py-5 px-6 animate-slide-up hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                  <Play size={16} className="text-accent" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted mb-0.5">Lesson {i + 1}</div>
                  <div className="font-semibold text-white">{lesson.title}</div>
                  {lesson.resources.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted mt-1">
                      <FileText size={11} />{' '}
                      {lesson.resources.length} resource
                      {lesson.resources.length !== 1 ? 's' : ''}
                    </div>
                  )}
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
