// frontend/src/api/students.js
import client from './client'

export const getStudents = () => client.get('/students').then((r) => r.data)
export const createStudent = (data) => client.post('/students', data).then((r) => r.data)
export const deleteStudent = (id) => client.delete(`/students/${id}`)
