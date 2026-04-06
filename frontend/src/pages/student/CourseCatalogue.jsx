// frontend/src/pages/student/CourseCatalogue.jsx
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getCourses } from '../../api/courses'
import { BookOpen, ArrowRight, Layers } from 'lucide-react'
import Card from '../../components/ui/Card'

const COURSE_COLORS = [
  'from-orange-500/20 to-orange-600/5',
  'from-violet-500/20 to-violet-600/5',
  'from-cyan-500/20 to-cyan-600/5',
  'from-emerald-500/20 to-emerald-600/5',
  'from-pink-500/20 to-pink-600/5',
  'from-amber-500/20 to-amber-600/5',
]

export default function CourseCatalogue() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })

  return (
    <div className="page-container py-12">
      <div className="mb-10 animate-slide-up">
        <div className="flex items-center gap-2 text-muted text-sm mb-2">
          <BookOpen size={14} /> AI Learning Hub
        </div>
        <h1 className="text-4xl font-black tracking-tight">All Courses</h1>
        <p className="text-muted mt-2">Choose a course to start learning</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course, i) => (
            <Link key={course.id} to={`/learn/${course.id}`}>
              <Card
                hover
                className="h-52 flex flex-col justify-between relative overflow-hidden animate-slide-up"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    COURSE_COLORS[i % COURSE_COLORS.length]
                  } pointer-events-none rounded-2xl`}
                />
                <div className="relative w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <Layers size={18} className="text-white" />
                </div>
                <div className="relative">
                  <h3 className="font-bold text-lg leading-tight mb-1">
                    {course.name}
                  </h3>
                  {course.description && (
                    <p className="text-xs text-muted line-clamp-2 mb-3">
                      {course.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-accent text-xs font-semibold">
                    Start learning <ArrowRight size={12} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
