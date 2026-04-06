// frontend/src/router/index.jsx
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import StudentLayout from '../layouts/StudentLayout'
import AdminLayout from '../layouts/AdminLayout'
import Dashboard from '../pages/student/Dashboard'
import CourseCatalogue from '../pages/student/CourseCatalogue'
import ModuleList from '../pages/student/ModuleList'
import LessonList from '../pages/student/LessonList'
import LessonPlayer from '../pages/student/LessonPlayer'
import AdminDashboard from '../pages/admin/AdminDashboard'
import CourseManager from '../pages/admin/CourseManager'
import ModuleManager from '../pages/admin/ModuleManager'
import LessonManager from '../pages/admin/LessonManager'
import StudentManager from '../pages/admin/StudentManager'

function RequireAuth({ role }) {
  const { token, user } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }
  return <Outlet />
}

function RedirectIfAuth() {
  const { token, user } = useAuthStore()
  if (token) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    element: <RedirectIfAuth />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/login', element: <Login /> },
    ],
  },
  {
    element: <RequireAuth role="student" />,
    children: [
      {
        element: <StudentLayout />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/learn', element: <CourseCatalogue /> },
          { path: '/learn/:courseId', element: <ModuleList /> },
          { path: '/learn/:courseId/:moduleId', element: <LessonList /> },
          { path: '/learn/lesson/:lessonId', element: <LessonPlayer /> },
        ],
      },
    ],
  },
  {
    element: <RequireAuth role="admin" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin', element: <AdminDashboard /> },
          { path: '/admin/courses', element: <CourseManager /> },
          { path: '/admin/courses/:courseId/modules', element: <ModuleManager /> },
          { path: '/admin/modules/:moduleId/lessons', element: <LessonManager /> },
          { path: '/admin/students', element: <StudentManager /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
