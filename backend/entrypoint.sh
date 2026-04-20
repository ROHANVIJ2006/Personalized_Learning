#!/bin/bash
set -e

echo "⏳ Waiting for database..."
sleep 3

echo "🌱 Seeding database..."
python seed_database.py || echo "Seed skipped (already seeded)"

echo "🚀 Starting SkillNova API..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
