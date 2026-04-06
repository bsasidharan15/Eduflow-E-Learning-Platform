// frontend/src/pages/admin/LessonManager.jsx
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import {
  getLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  reorderLessons,
} from '../../api/lessons'
import { uploadResource, deleteResource } from '../../api/resources'
import SortableItem from '../../components/admin/SortableItem'
import FileUploader from '../../components/admin/FileUploader'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Plus, Pencil, Trash2, ChevronLeft, FileText, X } from 'lucide-react'

export default function LessonManager() {
  const { moduleId } = useParams()
  const qc = useQueryClient()
  const sensors = useSensors(useSensor(PointerSensor))

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: () => getLessons(moduleId),
  })

  const [createOpen, setCreateOpen] = useState(false)
  const [editLesson, setEditLesson] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [uploading, setUploading] = useState(null)
  const [form, setForm] = useState({ title: '', youtube_url: '' })

  const createMut = useMutation({
    mutationFn: (data) => createLesson(moduleId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lessons', moduleId] })
      setCreateOpen(false)
      setForm({ title: '', youtube_url: '' })
    },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateLesson(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lessons', moduleId] })
      setEditLesson(null)
    },
  })

  const deleteMut = useMutation({
    mutationFn: deleteLesson,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lessons', moduleId] }),
  })

  const deleteResourceMut = useMutation({
    mutationFn: deleteResource,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['lessons', moduleId] }),
  })

  const reorderMut = useMutation({ mutationFn: reorderLessons })

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = lessons.findIndex((l) => l.id === active.id)
    const newIndex = lessons.findIndex((l) => l.id === over.id)
    const newOrder = arrayMove(lessons, oldIndex, newIndex)
    qc.setQueryData(['lessons', moduleId], newOrder)
    reorderMut.mutate(newOrder.map((l) => l.id))
  }

  const handleUpload = async (lessonId, file) => {
    setUploading(lessonId)
    try {
      await uploadResource(lessonId, file)
      qc.invalidateQueries({ queryKey: ['lessons', moduleId] })
    } finally {
      setUploading(null)
    }
  }

  return (
    <div className="p-8">
      <Link
        to="/admin/courses"
        className="flex items-center gap-1 text-sm text-muted hover:text-white mb-6 transition-colors"
      >
        <ChevronLeft size={14} /> Back to Courses
      </Link>
      <div className="flex items-center justify-between mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Lessons</h1>
          <p className="text-muted text-sm mt-1">
            Drag to reorder · Upload resources per lesson
          </p>
        </div>
        <Button
          onClick={() => {
            setForm({ title: '', youtube_url: '' })
            setCreateOpen(true)
          }}
        >
          <Plus size={16} /> New Lesson
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={lessons.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <SortableItem key={lesson.id} id={lesson.id}>
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">
                          {lesson.title}
                        </div>
                        <div className="text-xs text-muted truncate mt-0.5">
                          {lesson.youtube_url}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <FileUploader
                          onUpload={(file) => handleUpload(lesson.id, file)}
                          uploading={uploading === lesson.id}
                        />
                        <button
                          onClick={() => {
                            setEditLesson(lesson)
                            setForm({
                              title: lesson.title,
                              youtube_url: lesson.youtube_url,
                            })
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted hover:text-white"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(lesson)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-muted hover:text-red-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    {lesson.resources.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 pl-1">
                        {lesson.resources.map((r) => (
                          <div
                            key={r.id}
                            className="flex items-center gap-1.5 bg-elevated border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-muted"
                          >
                            <FileText size={11} className="text-accent" />
                            <span className="max-w-[140px] truncate">
                              {r.original_filename}
                            </span>
                            <button
                              onClick={() => deleteResourceMut.mutate(r.id)}
                              className="ml-0.5 hover:text-red-400 transition-colors"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Lesson"
      >
        <div className="space-y-4">
          <Input
            label="Lesson title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Introduction to NumPy"
          />
          <Input
            label="YouTube embed URL"
            value={form.youtube_url}
            onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
            placeholder="https://www.youtube.com/embed/VIDEO_ID"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="subtle" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createMut.mutate(form)}
              disabled={
                !form.title || !form.youtube_url || createMut.isPending
              }
            >
              {createMut.isPending ? 'Creating…' : 'Create Lesson'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!editLesson}
        onClose={() => setEditLesson(null)}
        title="Edit Lesson"
      >
        <div className="space-y-4">
          <Input
            label="Lesson title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Input
            label="YouTube embed URL"
            value={form.youtube_url}
            onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="subtle" onClick={() => setEditLesson(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                updateMut.mutate({ id: editLesson.id, data: form })
              }
              disabled={updateMut.isPending}
            >
              {updateMut.isPending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMut.mutate(deleteTarget.id)}
        title="Delete Lesson"
        message={`Delete "${deleteTarget?.title}"? Resources attached to this lesson will also be removed.`}
      />
    </div>
  )
}
