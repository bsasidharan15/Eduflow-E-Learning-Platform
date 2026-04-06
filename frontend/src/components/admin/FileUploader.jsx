// frontend/src/components/admin/FileUploader.jsx
import { useRef } from 'react'
import { Upload } from 'lucide-react'
import Button from '../ui/Button'

export default function FileUploader({ onUpload, uploading }) {
  const ref = useRef()

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onUpload(file)
      e.target.value = ''
    }
  }

  return (
    <div>
      <input ref={ref} type="file" className="hidden" onChange={handleChange} />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => ref.current.click()}
        disabled={uploading}
      >
        <Upload size={14} />
        {uploading ? 'Uploading…' : 'Upload File'}
      </Button>
    </div>
  )
}
