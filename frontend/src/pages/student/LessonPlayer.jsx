// frontend/src/pages/student/LessonPlayer.jsx
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getLesson, getLessons } from '../../api/lessons'
import { getResourceDownloadUrl } from '../../api/resources'
import LessonSidebar from '../../components/lesson/LessonSidebar'
import YouTubePlayer from '../../components/lesson/YouTubePlayer'
import { Download, Menu, FileText } from 'lucide-react'

export default function LessonPlayer() {
  const { lessonId } = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => getLesson(lessonId),
  })

  const { data: siblings = [] } = useQuery({
    queryKey: ['lessons', lesson?.module_id],
    queryFn: () => getLessons(lesson.module_id),
    enabled: !!lesson?.module_id,
  })

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-50 lg:z-auto top-0 lg:top-auto left-0 h-full w-72 shrink-0 border-r border-white/[0.06] transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <LessonSidebar
          moduleName="Current Module"
          lessons={siblings}
          currentLessonId={Number(lessonId)}
          onClose={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-4xl">
          {/* Mobile toggle */}
          <button
            className="lg:hidden mb-4 flex items-center gap-2 text-sm text-muted hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={16} /> Course contents
          </button>

          <YouTubePlayer url={lesson?.youtube_url} />

          <h1 className="text-2xl font-black mt-6 mb-6">{lesson?.title}</h1>

          {lesson?.resources?.length > 0 && (
            <div className="glass-card p-5">
              <h2 className="font-bold text-sm text-muted uppercase tracking-widest mb-4">
                Downloadable Resources
              </h2>
              <div className="space-y-2">
                {lesson.resources.map((r) => (
                  <a
                    key={r.id}
                    href={getResourceDownloadUrl(r.id)}
                    download
                    className="flex items-center gap-3 p-3 rounded-xl bg-elevated hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
                      <FileText size={14} className="text-accent" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-white/80 group-hover:text-white transition-colors truncate">
                      {r.original_filename}
                    </span>
                    <Download
                      size={14}
                      className="text-muted group-hover:text-accent transition-colors shrink-0"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
