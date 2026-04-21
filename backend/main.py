from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.database import engine, Base
from app.api.routes import auth, users, assessments, courses, recommendations, learning_paths, progress, chatbot

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting SkillNova API...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created.")
    from app.services.ai_service import ai_service
    await ai_service.initialize()
    logger.info("AI service initialized.")
    yield
    logger.info("Shutting down.")


app = FastAPI(
    title="SkillNova API",
    description="AI-powered personalized learning platform — MT-KT + DQN",
    version="1.0.0",
    lifespan=lifespan,
)

from fastapi import FastAPI, Request
import time

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://personalized-learning-blush.vercel.app",
        "https://personalized-learning-blush.vercel.app/",
        settings.FRONTEND_URL.rstrip("/"),
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    formatted_process_time = "{0:.2f}".format(process_time)
    logger.info(f"RID: {request.method} {request.url.path} - {response.status_code} ({formatted_process_time}ms)")
    return response

app.include_router(auth.router,            prefix="/api/auth",           tags=["Authentication"])
app.include_router(users.router,           prefix="/api/users",          tags=["Users"])
app.include_router(assessments.router,     prefix="/api/assessments",    tags=["Assessments"])
app.include_router(courses.router,         prefix="/api/courses",        tags=["Courses"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["AI Recommendations"])
app.include_router(learning_paths.router,  prefix="/api/learning-paths", tags=["Learning Paths"])
app.include_router(progress.router,        prefix="/api/progress",       tags=["Progress"])
app.include_router(chatbot.router,         prefix="/api/chatbot",        tags=["AI Chatbot"])


@app.get("/")
async def root():
    return {"message": "SkillNova API", "version": "1.0.0", "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
