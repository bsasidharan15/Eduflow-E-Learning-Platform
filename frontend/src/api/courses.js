// frontend/src/api/courses.js
import client from './client'

export const getCourses = () => client.get('/courses').then((r) => r.data)
export const createCourse = (data) => client.post('/courses', data).then((r) => r.data)
export const updateCourse = (id, data) => client.patch(`/courses/${id}`, data).then((r) => r.data)
export const deleteCourse = (id) => client.delete(`/courses/${id}`)
export const reorderCourses = (ids) => client.post('/courses/reorder', { ids }).then((r) => r.data)
