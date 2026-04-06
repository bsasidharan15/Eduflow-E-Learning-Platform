// frontend/src/pages/admin/StudentManager.jsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getStudents, createStudent, deleteStudent } from '../../api/students'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import { Plus, Trash2, Users } from 'lucide-react'

export default function StudentManager() {
  const qc = useQueryClient()
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  })

  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ email: '', full_name: '', password: '' })
  const [error, setError] = useState('')

  const createMut = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] })
      setCreateOpen(false)
      setForm({ email: '', full_name: '', password: '' })
      setError('')
    },
    onError: (err) =>
      setError(err.response?.data?.detail || 'Failed to create student'),
  })

  const deleteMut = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 animate-slide-up">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Students</h1>
          <p className="text-muted text-sm mt-1">
            {students.length} registered student
            {students.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={() => {
            setError('')
            setCreateOpen(true)
          }}
        >
          <Plus size={16} /> Add Student
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card h-14 animate-pulse" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <Users size={40} className="text-muted/30 mb-4" />
          <p className="text-muted font-medium">No students yet</p>
          <p className="text-sm text-muted/60 mt-1">
            Add a student to get started
          </p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden animate-slide-up p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-widest">
                  Name
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-widest">
                  Email
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-widest hidden sm:table-cell">
                  Joined
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr
                  key={s.id}
                  className={`${
                    i !== students.length - 1
                      ? 'border-b border-white/[0.04]'
                      : ''
                  } hover:bg-elevated/50 transition-colors`}
                >
                  <td className="px-5 py-3.5 font-medium text-white">
                    {s.full_name}
                  </td>
                  <td className="px-5 py-3.5 text-muted text-sm">{s.email}</td>
                  <td className="px-5 py-3.5 text-muted text-sm hidden sm:table-cell">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setDeleteTarget(s)}
                      className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-muted hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add Student"
      >
        <div className="space-y-4">
          <Input
            label="Full name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            placeholder="Jane Smith"
          />
          <Input
            label="Email address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="jane@example.com"
          />
          <Input
            label="Temporary password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="subtle" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createMut.mutate(form)}
              disabled={
                !form.email ||
                !form.full_name ||
                !form.password ||
                createMut.isPending
              }
            >
              {createMut.isPending ? 'Creating…' : 'Create Account'}
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMut.mutate(deleteTarget.id)}
        title="Delete Student"
        message={`Remove "${deleteTarget?.full_name}" (${deleteTarget?.email})? They will lose access immediately.`}
      />
    </div>
  )
}
