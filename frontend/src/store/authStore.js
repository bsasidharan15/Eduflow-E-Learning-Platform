// frontend/src/store/authStore.js
import { create } from 'zustand'

const stored = () => {
  try {
    const u = localStorage.getItem('eduflow_user')
    return u ? JSON.parse(u) : null
  } catch {
    return null
  }
}

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('eduflow_token') || null,
  user: stored(),

  setAuth: (token, user) => {
    localStorage.setItem('eduflow_token', token)
    localStorage.setItem('eduflow_user', JSON.stringify(user))
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem('eduflow_token')
    localStorage.removeItem('eduflow_user')
    set({ token: null, user: null })
  },
}))
