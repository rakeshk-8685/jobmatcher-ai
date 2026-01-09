# JobMatcher AI Portal

Production-grade AI-powered Job Matching Portal with MERN stack.

## Quick Start (Local Development)

### Option 1: Docker (Recommended)
```bash
# Start all services with one command
docker-compose up -d

# View logs
docker-compose logs -f
```

Services will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **AI Service**: http://localhost:8000
- **MongoDB**: localhost:27017

### Option 2: Manual Setup

**1. Start MongoDB locally or use Docker:**
```bash
docker run -d --name mongodb -p 27017:27017 mongo:7
```

**2. Backend:**
```bash
cd backend
npm install
npm run seed  # Load sample data
npm run dev
```

**3. Frontend:**
```bash
npm install
npm run dev
```

**4. AI Service (optional):**
```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Demo Accounts

| Role      | Email                    | Password     |
|-----------|--------------------------|--------------|
| Admin     | admin@jobmatcher.com     | password123  |
| Recruiter | recruiter@techcorp.com   | password123  |
| Candidate | john@email.com           | password123  |

## Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | React, Vite, TypeScript       |
| Backend    | Node.js, Express, MongoDB     |
| AI Service | Python, FastAPI, Transformers |
| DevOps     | Docker, Nginx                 |

## Project Structure

```
JobMatcher Web/
├── src/              # React frontend
├── backend/          # Express API
│   └── src/
│       ├── modules/  # Feature modules
│       └── middlewares/
├── ai-service/       # Python FastAPI
│   └── app/
│       ├── routes/
│       └── services/
└── docker-compose.yml
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Sign in
- `POST /api/auth/refresh` - Refresh token

### Jobs
- `GET /api/jobs` - List jobs
- `POST /api/jobs` - Create job (Recruiter)
- `GET /api/jobs/:id` - Get job details

### AI Service
- `POST /ai/ats-score` - Calculate ATS score
- `POST /ai/similarity` - Calculate AI similarity
- `POST /ai/parse-resume` - Parse resume text

## Features

- ✅ Dark/Light/System theme toggle
- ✅ Role-based access (Admin, Recruiter, User)
- ✅ JWT authentication with refresh tokens
- ✅ ATS scoring with weighted components
- ✅ AI semantic matching
- ✅ Docker deployment ready
