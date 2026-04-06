// frontend/src/api/resources.js
import client from './client'

export const uploadResource = (lessonId, file) => {
  const form = new FormData()
  form.append('file', file)
  return client.post(`/lessons/${lessonId}/resources`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)
}

export const deleteResource = (id) => client.delete(`/resources/${id}`)

export const getResourceDownloadUrl = (id) =>
  `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/resources/${id}/download`
