# SkillNova — AI-Powered Personalized Learning Platform

> Full-stack application implementing the IEEE paper:
> **"Multimodal Affective Knowledge Tracing and Causally-Aware Reinforcement Learning for Personalized Education"**

---

## Architecture Overview

```
skillnova/
├── backend/                        # FastAPI + Python 3.11
│   ├── main.py                     # App entry point  
│   ├── seed_database.py            # Seeds skills, questions, courses, demo user
│   ├── train_models.py             # Train MT-KT + DQN from dataset
│   ├── entrypoint.sh               # Docker startup script
│   ├── ai_models/
│   │   ├── mt_kt_model.py          # Transformer Knowledge Tracing (AUC 0.7641)
│   │   └── dqn_agent.py            # DQN Policy Engine (DR value 0.6908)
│   ├── datasets/
│   │   └── preprocess.py           # ASSISTments + EdNet preprocessing
│   └── app/
│       ├── api/routes/             # auth, users, assessments, courses,
│       │                           # recommendations, learning_paths, progress, chatbot
│       ├── models/user.py          # SQLAlchemy ORM models (10 tables)
│       ├── schemas/schemas.py      # Pydantic request/response types
│       ├── services/ai_service.py  # MT-KT + DQN inference orchestration
│       └── core/                   # config, database, JWT security
│
├── frontend/                       # React 18 + Vite + TypeScript + TailwindCSS
│   └── src/
│       ├── main.tsx                # Entry point
│       ├── lib/api.ts              # All backend API calls (no mock data)
│       ├── contexts/AuthContext.tsx # JWT auth state
│       └── app/
│           ├── App.tsx             # Router + AuthProvider
│           ├── routes.tsx          # All page routes
│           ├── pages/              # Dashboard, SkillAssessment, SkillProgress,
│           │                       # CourseRecommendations, LearningPath,
│           │                       # GovtCourses, Profile, Settings, Login, Register
│           └── components/         # Sidebar, ChatBot, RootLayout, UI components
│
├── docker-compose.yml              # Full stack: PostgreSQL + Redis + Backend + Frontend
├── run_local.sh                    # One-command local dev setup
└── README.md
```

---

## AI Models (from IEEE Paper)

### MT-KT — Multimodal Transformer Knowledge Tracing
| Component | Detail |
|-----------|--------|
| Architecture | 2-layer Transformer encoder |
| Attention heads | 4 heads per layer |
| Hidden size | 128 |
| Dropout | 0.1 |
| Inputs | skill_id + correctness + response_time (log-norm) + affective states |
| Affective states | focus, frustration, confusion, boredom (4-dim) |
| Output | P(correct response) → mastery probability |
| **AUC** | **0.7641** (vs LSTM-DKT 0.6485, SAKT 0.7100) |
| Optimizer | Adam, lr=0.0005, early stopping |

### DQN — Deep Q-Network Policy Engine
| Component | Detail |
|-----------|--------|
| State | 6-dim: [C_avg, T_penalty, E_focus, E_fru, E_con, E_bor] |
| Reward | +1.0·C_{t+1} + 0.5·E_focus − 0.5·(E_fru+E_con+E_bor) − T_pen |
| Network | 3-layer MLP, hidden=128, LayerNorm, ReLU |
| Training | Offline RL on logged interactions, experience replay |
| Evaluation | Doubly Robust (DR) estimator |
| **DR Value** | **0.6908** (+38% over uniform baseline 0.501) |

---

## Datasets — Manual Download Required

The AI models train on real educational datasets. You must download them manually.

### Dataset 1: ASSISTments 2012–2013
- **URL**: https://sites.google.com/site/assistmentsdata/home/2012-13-school-data-with-affect
- **File**: `2012-2013-data-with-predictions-4-final.csv`
- **Place at**: `backend/datasets/raw/assistments_2012_2013.csv`
- Size: ~800K interactions, 265 skills

### Dataset 2: EdNet-KT1
- **URL**: https://github.com/riiid/ednet (look under Releases)
- **File**: `KT1.zip` → extract contents
- **Place at**: `backend/datasets/raw/ednet_kt1/` (folder of per-user CSVs) OR a merged CSV
- Size: ~1.27M interactions, 188 skills

---

## Quick Start — Local (Recommended)

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 15+ (running locally)

### Option A: One-command setup
```bash
git clone / unzip the project
cd skillnova
bash run_local.sh
```
This installs all dependencies, creates the database, seeds data, and starts both servers.

### Option B: Manual setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL to your PostgreSQL connection

# Create DB and seed
createdb skillnova
python seed_database.py

# Start API
uvicorn main:app --reload --port 8000
# → http://localhost:8000  |  Docs: http://localhost:8000/docs
```

**Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
# → http://localhost:5173
```

### Demo login
```
Email:    demo@skillnova.ai
Password: demo123
```

---

## Training the AI Models

### Step 1 — Preprocess datasets
```bash
cd backend

# ASSISTments
python datasets/preprocess.py \
  --dataset assistments \
  --input  datasets/raw/assistments_2012_2013.csv \
  --output datasets/assistments_processed.csv

# EdNet
python datasets/preprocess.py \
  --dataset ednet \
  --input  datasets/raw/ednet_kt1/ \
  --output datasets/ednet_processed.csv
```

### Step 2 — Train models
```bash
# Train both MT-KT and DQN (recommended)
python train_models.py \
  --model both \
  --data  datasets/assistments_processed.csv \
  --save  ai_models/trained

# Expected output:
# mt_kt_best.pt     → AUC ~0.76
# dqn_policy.pt     → DR value ~0.69
# skill_encoder.json
# action_index.json
# dr_evaluation.json
```

### Step 3 — Restart backend
The backend auto-detects trained models on startup. Restart uvicorn and the app will switch from heuristic mode to real MT-KT + DQN inference.

> **Note**: Without trained models the app still works — it uses heuristic fallbacks for recommendations. All other features (auth, assessments, courses, progress, chatbot) are fully functional.

---

## Docker Deployment

```bash
# 1. Set environment variables
export SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
export ANTHROPIC_API_KEY=your-key-here  # optional, enables richer chatbot

# 2. Build and start
docker-compose up --build

# Access:
# Frontend:  http://localhost:5173
# Backend:   http://localhost:8000
# API Docs:  http://localhost:8000/docs
```

For production, set `FRONTEND_URL` in the backend environment to your domain and use a reverse proxy (nginx) in front of both services.

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login → JWT token |
| GET | `/api/users/me` | ✓ | Current user profile |
| PATCH | `/api/users/me` | ✓ | Update profile |
| GET | `/api/assessments/skills` | ✓ | All skills with question counts |
| POST | `/api/assessments/start` | ✓ | Fetch questions for a skill |
| POST | `/api/assessments/submit` | ✓ | Grade + MT-KT mastery prediction |
| GET | `/api/assessments/history` | ✓ | User assessment history |
| GET | `/api/recommendations` | ✓ | DQN-ranked course recommendations |
| GET | `/api/courses` | ✓ | All courses (filter: govt_only, level) |
| POST | `/api/courses/{id}/enroll` | ✓ | Enroll in course |
| GET | `/api/courses/enrolled` | ✓ | User enrollments |
| GET | `/api/progress/dashboard` | ✓ | Full dashboard data |
| GET | `/api/progress/skills` | ✓ | Per-skill progress + history |
| GET | `/api/progress/monthly` | ✓ | Monthly aggregate scores |
| GET | `/api/learning-paths` | ✓ | All learning paths |
| GET | `/api/learning-paths/my` | ✓ | User's active path |
| POST | `/api/chatbot` | ✓ | AI chatbot (MT-KT context aware) |

Full interactive docs at: **http://localhost:8000/docs**

---

## Optional: Richer Chatbot

Set `ANTHROPIC_API_KEY` in `backend/.env` to enable Claude-powered responses in the chatbot. Without it, the chatbot uses a rule-based system that still has full access to the user's real MT-KT state data.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, TailwindCSS v4, Framer Motion |
| UI Components | Radix UI, shadcn/ui, Lucide Icons, Recharts |
| Backend | FastAPI 0.115, Python 3.11, Uvicorn |
| Database | PostgreSQL 15, SQLAlchemy 2.0, Alembic |
| AI/ML | PyTorch 2.4, NumPy, Pandas, scikit-learn |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Deployment | Docker, Docker Compose, Nginx |
