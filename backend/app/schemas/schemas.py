from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime


# ── Auth ──
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    career_goal: Optional[str] = "AI Engineer"
    location: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    location: Optional[str]
    career_goal: Optional[str]
    streak_days: int
    total_xp: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    career_goal: Optional[str] = None


# ── Assessment ──
class QuestionOut(BaseModel):
    id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    difficulty: str

    class Config:
        from_attributes = True


class AssessmentStartRequest(BaseModel):
    skill_id: int


class AssessmentSubmitRequest(BaseModel):
    skill_id: int
    responses: List[Dict[str, Any]]  # [{question_id, answer, time_taken_seconds}]


class AssessmentResultOut(BaseModel):
    id: int
    skill_name: str
    score: float
    total_questions: int
    percentage: float
    mastery_probability: float
    affective_state: Optional[Dict]
    recommendations: List[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ── Course ──
class CourseOut(BaseModel):
    id: int
    title: str
    provider: str
    instructor: Optional[str]
    description: Optional[str]
    duration_weeks: Optional[int]
    level: str
    rating: float
    review_count: int
    enrolled_count: int
    price: str
    url: Optional[str]
    is_govt_certified: bool
    tags: Optional[List[str]]
    match_score: Optional[float] = None

    class Config:
        from_attributes = True


# ── Recommendation ──
class RecommendationOut(BaseModel):
    courses: List[CourseOut]
    ai_insight: Dict[str, str]
    skill_gaps: List[Dict[str, Any]]
    next_action: str


# ── Progress ──
class SkillProgressOut(BaseModel):
    skill_id: int
    skill_name: str
    current_score: float
    target_score: float
    mastery_probability: float
    improvement: float
    category: str


class DashboardOut(BaseModel):
    user: UserOut
    overall_progress: float
    streak_days: int
    weekly_hours: List[Dict]
    skill_profiles: List[SkillProgressOut]
    recent_courses: List[CourseOut]
    ai_recommendation: str


# ── Learning Path ──
class LearningPathOut(BaseModel):
    id: int
    title: str
    career_goal: str
    progress_percent: float
    phases: List[Dict]
    weekly_schedule: List[Dict]

    class Config:
        from_attributes = True


# ── Chatbot ──
class ChatMessage(BaseModel):
    message: str
    conversation_history: Optional[List[Dict]] = []


class ChatResponse(BaseModel):
    response: str
    suggestions: List[str]
    action_type: Optional[str] = None
