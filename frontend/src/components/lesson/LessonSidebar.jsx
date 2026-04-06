// frontend/src/components/lesson/LessonSidebar.jsx
import { Link } from 'react-router-dom'
import { Play, X } from 'lucide-react'

export default function LessonSidebar({ moduleName, lessons, currentLessonId, onClose }) {
  return (
    <div className="flex flex-col h-full bg-surface">
      <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-muted mb-0.5">Module</div>
          <div className="font-semibold text-sm truncate">{moduleName}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors ml-2"
          >
            <X size={16} className="text-muted" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {lessons.map((lesson, i) => {
          const isActive = lesson.id === currentLessonId
          return (
            <Link
              key={lesson.id}
              to={`/learn/lesson/${lesson.id}`}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group border-l-2 pl-2.5 ${
                isActive
                  ? 'bg-accent/15 border-accent'
                  : 'hover:bg-elevated border-transparent'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-accent' : 'bg-elevated group-hover:bg-white/10'
                }`}
              >
                <Play
                  size={12}
                  className={isActive ? 'text-white' : 'text-muted'}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted">Lesson {i + 1}</div>
                <div
                  className={`text-sm font-medium truncate ${
                    isActive ? 'text-white' : 'text-white/70'
                  }`}
                >
                  {lesson.title}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
