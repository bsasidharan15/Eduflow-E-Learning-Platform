// frontend/src/api/modules.js
import client from './client'

export const getModules = (courseId) =>
  client.get(`/courses/${courseId}/modules`).then((r) => r.data)
export const createModule = (courseId, data) =>
  client.post(`/courses/${courseId}/modules`, data).then((r) => r.data)
export const updateModule = (id, data) =>
  client.patch(`/modules/${id}`, data).then((r) => r.data)
export const deleteModule = (id) => client.delete(`/modules/${id}`)
export const reorderModules = (ids) =>
  client.post('/modules/reorder', { ids }).then((r) => r.data)
