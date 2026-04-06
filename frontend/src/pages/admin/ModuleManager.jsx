// frontend/src/pages/admin/ModuleManager.jsx
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
import { getCourses } from '../../api/courses'
import {
  getModules,
  createModule,
  updateModule,
  deleteModule,
  reorderModules,
} from '../../api/modules'
import SortableItem from '../../components/admin/SortableItem'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Plus, Pencil, Trash2, Video, ChevronRight, ChevronLeft } from 'lucide-react'

export default function ModuleManager() {
  const { courseId } = useParams()
  const qc = useQueryClient()
  const sensors = useSensors(useSensor(PointerSensor))

  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })
  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: () => getModules(courseId),
  })

  const course = courses.find((c) => c.id === Number(courseId))

  const [createOpen, setCreateOpen] = useState(false)
  const [editModule, setEditModule] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [name, setName] = useState('')

  const createMut = useMutation({
    mutationFn: (data) => createModule(courseId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['modules', courseId] })
      setCreateOpen(false)
      setName('')
    },
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }) => updateModule(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['modules', courseId] })
      setEditModule(null)
    },
  })

  const deleteMut = useMutation({
    mutationFn: deleteModule,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['modules', courseId] }),
  })

  const reorderMut = useMutation({ mutationFn: reorderModules })

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = modules.findIndex((m) => m.id === active.id)
    const newIndex = modules.findIndex((m) => m.id === over.id)
    const newOrder = arrayMove(modules, oldIndex, newIndex)
    qc.setQueryData(['modules', courseId], newOrder)
    reorderMut.mutate(newOrder.map((m) => m.id))
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
          <h1 className="text-3xl font-black tracking-tight">
            {course?.name}
          </h1>
          <p className="text-muted text-sm mt-1">
            Modules · Drag to reorder · Click to manage lessons
          </p>
        </div>
        <Button
          onClick={() => {
            setName('')
            setCreateOpen(true)
          }}
        >
          <Plus size={16} /> New Module
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
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
            items={modules.map((m) => m.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {modules.map((module) => (
                <SortableItem key={module.id} id={module.id}>
                  <div className="glass-card flex items-center gap-4 py-4 px-5">
                    <div className="flex-1 font-semibold text-white truncate">
                      {module.name}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={`/admin/modules/${module.id}/lessons`}
                      >
                        <Button variant="subtle" size="sm">
                          <Video size={13} /> Lessons{' '}
                          <ChevronRight size={13} />
                        </Button>
                      </Link>
                      <button
                        onClick={() => {
                          setEditModule(module)
                          setName(module.name)
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted hover:text-white"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(module)}
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
        title="New Module"
      >
        <div className="space-y-4">
          <Input
            label="Module name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Week 1: Foundations"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="subtle" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createMut.mutate({ name })}
              disabled={!name || createMut.isPending}
            >
              {createMut.isPending ? 'Creating…' : 'Create Module'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!editModule}
        onClose={() => setEditModule(null)}
        title="Edit Module"
      >
        <div className="space-y-4">
          <Input
            label="Module name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="subtle" onClick={() => setEditModule(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                updateMut.mutate({ id: editModule.id, data: { name } })
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
        title="Delete Module"
        message={`Delete "${deleteTarget?.name}"? All lessons inside will be permanently removed.`}
      />
    </div>
  )
}
