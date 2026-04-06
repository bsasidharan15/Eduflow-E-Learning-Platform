// frontend/src/components/admin/ConfirmDialog.jsx
import Modal from '../ui/Modal'
import Button from '../ui/Button'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-muted mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="subtle" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            onConfirm()
            onClose()
          }}
        >
          Delete
        </Button>
      </div>
    </Modal>
  )
}
