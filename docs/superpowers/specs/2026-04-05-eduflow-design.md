# EduFlow — Design Spec
**Date:** 2026-04-05  
**Status:** Approved

---

## Overview

EduFlow is a private internal AI learning platform with two roles: one admin and multiple students. It hosts structured video-based courses (YouTube embeds) organized into categories → modules → lessons, with downloadable resource documents per lesson. The admin controls all content and student accounts; there is no public registration.

---

## 1. Architecture & Tech Stack

### Monorepo Structure
```
eduflow/
├── frontend/    # React 18 + Vite + Tailwind CSS + React Router v6
├── backend/     # FastAPI + SQLAlchemy 2.0 + SQLite + Alembic
└── README.md
```

### Frontend Libraries
| Purpose | Library |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| Server state | TanStack Query (React Query v5) |
| UI state / auth | Zustand |
| HTTP client | Axios |
| Icons | Lucide React |
| Drag-to-reorder | @dnd-kit/core + @dnd-kit/sortable |

### Backend Libraries
| Purpose | Library |
|---|---|
| Framework | FastAPI |
| ORM | SQLAlchemy 2.0 |
| Migrations | Alembic |
| Auth | python-jose[cryptography] + passlib[bcrypt] |
| File uploads | python-multipart |
| Config | python-dotenv |
| Server | Uvicorn |

### Auth
- JWT tokens stored in `localStorage` on the frontend
- Token payload includes: `sub` (user id), `role` (admin|student), `exp`
- All protected routes use FastAPI dependency injection (`get_current_user`)
- Token expiry: 24 hours

### File Storage
- Uploaded resources stored at `backend/uploads/lessons/{lesson_id}/`
- Original filename preserved in DB; stored filename may be sanitized
- Files served via `GET /resources/{id}/download` with `Content-Disposition: attachment`

### CORS
- Dev origins: `http://localhost:5173`
- Production origin: configurable via `ALLOWED_ORIGINS` env var

---

## 2. Database Schema

```sql
users
  id            INTEGER PRIMARY KEY
  email         TEXT UNIQUE NOT NULL
  password_hash TEXT NOT NULL
  full_name     TEXT NOT NULL
  role          TEXT NOT NULL  -- 'admin' | 'student'
  created_at    DATETIME DEFAULT now

courses
  id            INTEGER PRIMARY KEY
  name          TEXT NOT NULL
  description   TEXT
  order_index   INTEGER NOT NULL DEFAULT 0
  created_at    DATETIME DEFAULT now

modules
  id            INTEGER PRIMARY KEY
  course_id     INTEGER REFERENCES courses(id) ON DELETE CASCADE
  name          TEXT NOT NULL
  order_index   INTEGER NOT NULL DEFAULT 0
  created_at    DATETIME DEFAULT now

lessons
  id            INTEGER PRIMARY KEY
  module_id     INTEGER REFERENCES modules(id) ON DELETE CASCADE
  title         TEXT NOT NULL
  youtube_url   TEXT NOT NULL  -- full embed URL e.g. https://www.youtube.com/embed/VIDEO_ID
  order_index   INTEGER NOT NULL DEFAULT 0
  created_at    DATETIME DEFAULT now

lesson_resources
  id                INTEGER PRIMARY KEY
  lesson_id         INTEGER REFERENCES lessons(id) ON DELETE CASCADE
  original_filename TEXT NOT NULL
  stored_path       TEXT NOT NULL
  created_at        DATETIME DEFAULT now
```

**Notes:**
- Cascade deletes propagate: course → modules → lessons → resources
- `order_index` controls display order for courses, modules, and lessons
- No progress tracking (not in scope)

---

## 3. Backend API Routes

### Auth
```
POST /auth/login          → { access_token, token_type, role, user }
GET  /auth/me             → current user info (requires auth)
```

### Courses
```
GET    /courses                    → list all courses ordered by order_index
POST   /courses                    → [admin] create course
PATCH  /courses/{id}               → [admin] update name/description
DELETE /courses/{id}               → [admin] delete course
POST   /courses/reorder            → [admin] update order_index for list of ids
```

### Modules
```
GET    /courses/{id}/modules       → list modules in course
POST   /courses/{id}/modules       → [admin] create module
PATCH  /modules/{id}               → [admin] update module
DELETE /modules/{id}               → [admin] delete module
POST   /modules/reorder            → [admin] reorder modules
```

### Lessons
```
GET    /modules/{id}/lessons       → list lessons in module
POST   /modules/{id}/lessons       → [admin] create lesson
PATCH  /lessons/{id}               → [admin] update lesson
DELETE /lessons/{id}               → [admin] delete lesson
POST   /lessons/reorder            → [admin] reorder lessons
```

### Resources
```
POST   /lessons/{id}/resources     → [admin] upload file(s) (multipart)
DELETE /resources/{id}             → [admin] delete resource
GET    /resources/{id}/download    → [student+admin] download file
```

### Students
```
GET    /students                   → [admin] list all students
POST   /students                   → [admin] create student account
DELETE /students/{id}              → [admin] delete student
```

---

## 4. Frontend Page Map & Routing

```
/                              → Landing page (unauthenticated only)
/login                         → Unified login (auto-routes by role after login)

── Student routes (requires auth, role=student) ──
/dashboard                     → Student dashboard
/learn                         → Course catalogue grid
/learn/:courseId               → Module list for a course
/learn/:courseId/:moduleId     → Lesson list for a module
/learn/lesson/:lessonId        → Lesson player (sidebar + video + resources)

── Admin routes (requires auth, role=admin) ──
/admin                         → Admin dashboard (4 action panels)
/admin/courses                 → Course CRUD + drag reorder
/admin/courses/:id/modules     → Module CRUD + drag reorder
/admin/modules/:id/lessons     → Lesson CRUD + drag reorder + file upload
/admin/students                → Student table + create/delete
```

### Route Guards
| Scenario | Behaviour |
|---|---|
| Unauthenticated → any protected route | Redirect to `/login` |
| Student → `/admin/*` | Redirect to `/dashboard` |
| Admin → `/dashboard` or `/learn/*` | Redirect to `/admin` |
| Authenticated → `/` or `/login` | Redirect to their dashboard |

---

## 5. Visual Design System

### Color Tokens (Tailwind custom config)
| Token | Hex | Usage |
|---|---|---|
| `bg-base` | `#0E0C1A` | App shell, page backgrounds |
| `bg-surface` | `#16132A` | Cards, panels |
| `bg-elevated` | `#1E1A36` | Hover states, dropdowns |
| `accent` | `#F97316` | Buttons, highlights, active states |
| `accent-glow` | `rgba(249,115,22,0.25)` | Box-shadow glow on hover |
| `border-subtle` | `rgba(255,255,255,0.08)` | Card borders (glass edge) |
| `text-primary` | `#FFFFFF` | Main text |
| `text-muted` | `#A09DB8` | Secondary text, labels |

### Component Patterns
- **Cards:** `bg-surface rounded-2xl border border-subtle backdrop-blur-sm`, orange glow `box-shadow` on hover
- **Primary button:** Solid orange bg, white text, `hover:brightness-110`, subtle scale on press
- **Ghost button:** Transparent bg, orange border, orange text
- **Typography:** `Inter` font; headings `font-weight: 800–900`, tight `letter-spacing`
- **Micro-animations:** `transition-all duration-300`, `hover:scale-[1.02]` on course cards, `hover:-translate-y-1` on lesson rows
- **Lesson sidebar:** `w-72` fixed, scrollable, current lesson has orange `border-l-2` + `bg-elevated`
- **Landing hero:** Full viewport height, large bold headline, subtle gradient overlay, animated glow behind CTA

### Responsiveness
- Mobile-first Tailwind breakpoints (`sm`, `md`, `lg`)
- Course grid: 1 col mobile → 2 col tablet → 3–4 col desktop
- Lesson player sidebar: hidden on mobile (toggle button), visible from `lg` breakpoint

---

## 6. Key Component Breakdown

### Frontend Components
```
src/
├── api/
│   ├── client.js           # Axios instance with JWT interceptor
│   ├── auth.js
│   ├── courses.js
│   ├── modules.js
│   ├── lessons.js
│   ├── resources.js
│   └── students.js
├── store/
│   └── authStore.js        # Zustand: token, user, login/logout actions
├── router/
│   └── index.jsx           # All routes + ProtectedRoute + RoleRoute components
├── layouts/
│   ├── StudentLayout.jsx   # Nav + outlet
│   └── AdminLayout.jsx     # Sidebar nav + outlet
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── student/
│   │   ├── Dashboard.jsx
│   │   ├── CourseCatalogue.jsx
│   │   ├── ModuleList.jsx
│   │   ├── LessonList.jsx
│   │   └── LessonPlayer.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── CourseManager.jsx
│       ├── ModuleManager.jsx
│       ├── LessonManager.jsx
│       └── StudentManager.jsx
└── components/
    ├── ui/
    │   ├── Button.jsx
    │   ├── Card.jsx
    │   ├── Modal.jsx
    │   ├── Input.jsx
    │   └── Badge.jsx
    ├── lesson/
    │   ├── LessonSidebar.jsx
    │   └── YouTubePlayer.jsx
    └── admin/
        ├── SortableItem.jsx    # dnd-kit wrapper
        ├── FileUploader.jsx
        └── ConfirmDialog.jsx
```

### Backend Structure
```
backend/
├── app/
│   ├── main.py             # FastAPI app, CORS, startup events
│   ├── database.py         # SQLAlchemy engine + session
│   ├── models.py           # All ORM models
│   ├── schemas.py          # All Pydantic schemas (request/response)
│   ├── auth.py             # JWT creation + verification + dependencies
│   ├── seed.py             # Admin + sample course seeding
│   ├── routers/
│   │   ├── auth.py
│   │   ├── courses.py
│   │   ├── modules.py
│   │   ├── lessons.py
│   │   ├── resources.py
│   │   └── students.py
│   └── uploads/            # File storage (gitignored)
├── alembic/
├── alembic.ini
├── requirements.txt
└── .env.example
```

---

## 7. Seed Data

### Admin Account
- Email: `admin@eduflow.com` (override via `ADMIN_EMAIL` env)
- Password: `Admin@1234` (override via `ADMIN_PASSWORD` env)

### Seed Courses (AI/ML)
1. **Python for AI** — 2 modules (Basics, Advanced), 1 lesson each
2. **Machine Learning** — 2 modules (Supervised Learning, Unsupervised Learning), 1 lesson each
3. **Deep Learning** — 1 module (Neural Networks), 1 lesson
4. **Data Science** — 1 module (Data Analysis), 1 lesson

Lessons use a public YouTube embed URL as placeholder. Seed is idempotent — only runs if `users` table is empty.

---

## 8. Environment Variables

### Backend `.env`
```
DATABASE_URL=sqlite:///./eduflow.db
SECRET_KEY=change-me-to-a-random-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_HOURS=24
ADMIN_EMAIL=admin@eduflow.com
ADMIN_PASSWORD=Admin@1234
ADMIN_NAME=EduFlow Admin
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:8000
```

---

## 9. Deployment

### Frontend → Vercel
- `cd frontend && npm run build` → deploys `dist/`
- Set `VITE_API_URL` to production backend URL in Vercel env vars

### Backend → Render
- Build command: `pip install -r requirements.txt && alembic upgrade head`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Set all env vars in Render dashboard
- SQLite file persists on Render disk (mount `/data` volume)

---

## 10. Constraints & Decisions

| Decision | Choice | Reason |
|---|---|---|
| Student registration | Admin-only | Private internal platform |
| Video delivery | YouTube iframe only | No self-hosted video infra |
| File storage | Local filesystem | No paid S3; sufficient for internal use |
| Auth token storage | localStorage | Simpler for SPA; short expiry mitigates risk |
| DB | SQLite | Zero-config, sufficient for internal scale |
| Progress tracking | Not implemented | Not in scope |
| Admin count | Exactly one | Seeded; no admin registration UI |
