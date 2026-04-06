// frontend/src/pages/admin/CourseManager.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
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
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  reorderCourses,
} from '../../api/courses'
import SortableItem from '../../components/admin/SortableItem'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Plus, Pencil, Trash2, Layers, ChevronRight } from 'lucide-react'

export default function CourseManager() {
  const qc = useQueryClient()
  const sensors = useSensors(useSensor(PointerSensor))

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })

  const [createOpen, setCreateOpen] = useState(false)
  const [editCourse, setEditCourse] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ name: '', description: '' })

  const createMut = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] })
      setCreateOpen(false)
      setForm({ name: '', description: '' })
    },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateCourse(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['courses'] })
      setEditCourse(null)
    },
  })

  const deleteMut = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
  })

  const reorderMut = useMutation({ mutationFn: reorderCourses })

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = courses.findIndex((c) => c.id === active.id)
    const newIndex = courses.findIndex((c) => c.id === over.id)
    const newOrder = arrayMove(courses, oldIndex, newIndex)
    qc.setQueryData(['courses'], newOrder)
    reorderMut.mutate(newOrder.map((c) => c.id))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Courses</h1>
          <p className="text-muted text-sm mt-1">
            Drag to reorder · Click to manage modules
          </p>
        </div>
        <Button
          onClick={() => {
            setForm({ name: '', description: '' })
            setCreateOpen(true)
          }}
        >
          <Plus size={16} /> New Course
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card h-16 animate-pulse" />
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={courses.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {courses.map((course) => (
                <SortableItem key={course.id} id={course.id}>
                  <div className="glass-card flex items-center gap-4 py-4 px-5">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">
                        {course.name}
                      </div>
                      {course.description && (
                        <div className="text-xs text-muted truncate mt-0.5">
                          {course.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link to={`/admin/courses/${course.id}/modules`}>
                        <Button variant="subtle" size="sm">
                          <Layers size={13} /> Modules{' '}
                          <ChevronRight size={13} />
                        </Button>
                      </Link>
                      <button
                        onClick={() => {
                          setEditCourse(course)
                          setForm({
                            name: course.name,
                            description: course.description || '',
                          })
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted hover:text-white"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(course)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-muted hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
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
        title="New Course"
      >
        <div className="space-y-4">
          <Input
            label="Course name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Natural Language Processing"
          />
          <Input
            label="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief description"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="subtle" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createMut.mutate(form)}
              disabled={!form.name || createMut.isPending}
            >
              {createMut.isPending ? 'Creating…' : 'Create Course'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!editCourse}
        onClose={() => setEditCourse(null)}
        title="Edit Course"
      >
        <div className="space-y-4">
          <Input
            label="Course name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="subtle" onClick={() => setEditCourse(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                updateMut.mutate({ id: editCourse.id, data: form })
              }
              disabled={updateMut.isPending}
            >
              {updateMut.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMut.mutate(deleteTarget.id)}
        title="Delete Course"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will also delete all modules and lessons inside it.`}
      />
    </div>
  )
}
