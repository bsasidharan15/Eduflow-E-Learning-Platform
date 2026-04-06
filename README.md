# EduFlow — AI Learning Platform

A private, internal e-learning platform for AI/ML courses. Features YouTube-embedded video lessons, downloadable resources, admin content management, and a premium dark UI inspired by crystallize.com.

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+

### 1. Clone and set up backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env          # edit SECRET_KEY and other vars
alembic upgrade head          # run migrations
uvicorn app.main:app --reload # starts on http://localhost:8000
```

On first start the database is seeded automatically with:
- **Admin account:** `admin@eduflow.com` / `Admin@1234`
- **4 AI/ML courses:** Python for AI, Machine Learning, Deep Learning, Data Science

### 2. Set up frontend

```bash
cd frontend
cp .env.example .env          # set VITE_API_URL if needed
npm install
npm run dev                   # starts on http://localhost:5173
```

Visit `http://localhost:5173` and sign in.

---

## Environment Variables

### `backend/.env`

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./eduflow.db` | SQLAlchemy database URL |
| `SECRET_KEY` | *(required)* | JWT signing secret — **change in production** |
| `ALGORITHM` | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_HOURS` | `24` | Token lifetime in hours |
| `ADMIN_EMAIL` | `admin@eduflow.com` | Seeded admin email |
| `ADMIN_PASSWORD` | `Admin@1234` | Seeded admin password |
| `ADMIN_NAME` | `EduFlow Admin` | Seeded admin display name |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated CORS origins |

### `frontend/.env`

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Backend base URL |

---

## Running Tests

```bash
cd backend
python -m pytest tests/ -v
```

Expected: 28 tests passing.

---

## Project Structure

```
eduflow/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── database.py      # SQLAlchemy engine + session
│   │   ├── models.py        # ORM models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── auth.py          # JWT auth + dependencies
│   │   ├── seed.py          # Admin + course seeding
│   │   ├── routers/         # Route handlers
│   │   └── uploads/         # Uploaded resource files
│   ├── alembic/             # Database migrations
│   ├── tests/               # Pytest test suite
│   └── requirements.txt
└── frontend/
    └── src/
        ├── api/             # Axios API modules
        ├── store/           # Zustand auth store
        ├── router/          # React Router + guards
        ├── layouts/         # Student and admin layouts
        ├── pages/           # All page components
        └── components/      # Reusable UI components
```

---

## Deployment

### Frontend → Vercel

1. Push to GitHub and connect the repo in Vercel
2. Set root directory to `frontend/`
3. Build command: `npm run build` — output: `dist/`
4. Set `VITE_API_URL` in Vercel environment variables to your production backend URL

### Backend → Render

1. Connect GitHub repo in Render, set root directory to `backend/`
2. Build command: `pip install -r requirements.txt && alembic upgrade head`
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set all environment variables in Render dashboard
5. Add a **persistent disk** mounted at `/app/app/uploads` so uploaded files survive deploys

---

## User Roles

| Role | Access | Created by |
|---|---|---|
| **Admin** | Full admin panel — manage courses, modules, lessons, students | Seeded automatically on first run |
| **Student** | Browse courses, watch lessons, download resources | Admin creates accounts from the admin panel |

There is no public student registration — the admin controls all access.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, SQLAlchemy 2.0, Alembic, SQLite |
| Auth | python-jose (JWT), passlib (bcrypt) |
| Frontend | React 18, Vite, Tailwind CSS v3 |
| State | TanStack Query v5 (server), Zustand (auth) |
| Routing | React Router v6 |
| Drag-to-reorder | @dnd-kit/sortable |
| Video | YouTube iframe embed |
