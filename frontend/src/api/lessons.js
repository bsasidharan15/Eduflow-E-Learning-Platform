// frontend/src/api/lessons.js
import client from './client'

export const getLessons = (moduleId) =>
  client.get(`/modules/${moduleId}/lessons`).then((r) => r.data)
export const getLesson = (id) => client.get(`/lessons/${id}`).then((r) => r.data)
export const createLesson = (moduleId, data) =>
  client.post(`/modules/${moduleId}/lessons`, data).then((r) => r.data)
export const updateLesson = (id, data) =>
  client.patch(`/lessons/${id}`, data).then((r) => r.data)
export const deleteLesson = (id) => client.delete(`/lessons/${id}`)
export const reorderLessons = (ids) =>
  client.post('/lessons/reorder', { ids }).then((r) => r.data)
