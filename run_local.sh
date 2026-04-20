#!/bin/bash
# SkillNova Local Development Runner
# Run this from the project root: bash run_local.sh

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║    SkillNova Local Dev Setup         ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"

# ── 1. Check prerequisites ──────────────────────────────────────────────────
echo -e "\n${YELLOW}[1/5] Checking prerequisites...${NC}"
command -v python3 >/dev/null || { echo -e "${RED}Python 3 required${NC}"; exit 1; }
command -v node    >/dev/null || { echo -e "${RED}Node.js 18+ required${NC}"; exit 1; }
command -v psql    >/dev/null || { echo -e "${YELLOW}PostgreSQL not found - install it or use Docker${NC}"; }
echo -e "${GREEN}✓ Prerequisites OK${NC}"

# ── 2. Backend setup ────────────────────────────────────────────────────────
echo -e "\n${YELLOW}[2/5] Setting up backend...${NC}"
cd "$ROOT/backend"

if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✓ Virtual environment created"
fi

source venv/bin/activate
pip install -r requirements.txt -q
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Setup .env
if [ ! -f ".env" ]; then
    cp .env.example .env
    SECRET=$(python3 -c "import secrets; print(secrets.token_hex(32))")
    sed -i "s/changeme-use-openssl-rand-hex-32-in-production/$SECRET/" .env
    echo -e "${GREEN}✓ .env created with random SECRET_KEY${NC}"
    echo -e "${YELLOW}  Edit backend/.env to set your DATABASE_URL if needed${NC}"
fi

# ── 3. Database setup ───────────────────────────────────────────────────────
echo -e "\n${YELLOW}[3/5] Setting up database...${NC}"
DB_URL=$(grep DATABASE_URL .env | cut -d= -f2)
echo "  Using: $DB_URL"

# Try to create DB if it doesn't exist
DB_NAME=$(echo "$DB_URL" | sed 's|.*\/||')
createdb "$DB_NAME" 2>/dev/null && echo "✓ Database '$DB_NAME' created" || echo "  Database already exists"

echo -e "\n${YELLOW}[4/5] Seeding database...${NC}"
python seed_database.py
echo -e "${GREEN}✓ Database seeded${NC}"

# ── 4. Frontend setup ───────────────────────────────────────────────────────
echo -e "\n${YELLOW}[5/5] Setting up frontend...${NC}"
cd "$ROOT/frontend"
npm install --legacy-peer-deps -q
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# ── 5. Launch ───────────────────────────────────────────────────────────────
echo -e "\n${GREEN}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Starting SkillNova...               ║${NC}"
echo -e "${GREEN}║  Frontend: http://localhost:5173     ║${NC}"
echo -e "${GREEN}║  Backend:  http://localhost:8000     ║${NC}"
echo -e "${GREEN}║  API Docs: http://localhost:8000/docs║${NC}"
echo -e "${GREEN}║  Demo:     demo@skillnova.ai/demo123 ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════╝${NC}\n"

# Start backend in background
cd "$ROOT/backend"
source venv/bin/activate
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Start frontend
cd "$ROOT/frontend"
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID 2>/dev/null; echo 'Servers stopped.'" EXIT
