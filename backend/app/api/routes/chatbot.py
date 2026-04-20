"""chatbot.py — AI chatbot powered by real MT-KT state + LLM responses."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List, Dict
import httpx
import os

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, UserSkillProfile, AssessmentResult
from app.schemas.schemas import ChatMessage, ChatResponse
from app.services.ai_service import ai_service

router = APIRouter()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")


async def call_llm(system_prompt: str, messages: List[Dict], user_context: str) -> str:
    """Call Claude API for chatbot responses."""
    if not ANTHROPIC_API_KEY:
        return _rule_based_response(messages[-1]["content"] if messages else "", user_context)

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 500,
                    "system": system_prompt,
                    "messages": messages,
                },
            )
            data = resp.json()
            if "content" in data:
                return data["content"][0]["text"]
        except Exception as e:
            pass

    return _rule_based_response(messages[-1]["content"] if messages else "", user_context)


def _rule_based_response(message: str, context: str) -> str:
    """Fallback rule-based responses when API key not set."""
    msg = message.lower()
    if any(w in msg for w in ["recommend", "course", "learn"]):
        return (f"Based on your profile, {context} I recommend starting with the courses shown in your recommendations tab. "
                "They've been ranked by our DQN model based on your assessment performance and learning state.")
    elif any(w in msg for w in ["skill", "gap", "weak", "improve"]):
        return (f"{context} Your skill gaps have been identified through the MT-KT knowledge tracing model. "
                "Focus on the skills with the lowest mastery probability first.")
    elif any(w in msg for w in ["path", "plan", "schedule"]):
        return ("Your personalized learning path is built around your career goal. "
                "Check the Learning Path tab to see your current phase and weekly schedule.")
    elif any(w in msg for w in ["assessment", "test", "quiz"]):
        return ("Take skill assessments in the Assessment tab. Each assessment uses "
                "our Transformer-based knowledge tracing model to predict your mastery probability.")
    else:
        return ("I'm your AI learning assistant. I can help you with course recommendations, "
                "skill gap analysis, learning schedule creation, and more. What would you like to know?")


@router.post("", response_model=ChatResponse)
async def chat(
    data: ChatMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """AI chatbot with real user context from MT-KT state."""

    # Get user's skill profiles for context
    profiles = (
        db.query(UserSkillProfile)
        .options(joinedload(UserSkillProfile.skill))
        .filter(UserSkillProfile.user_id == current_user.id)
        .all()
    )

    recent_results = (
        db.query(AssessmentResult)
        .filter(AssessmentResult.user_id == current_user.id)
        .order_by(AssessmentResult.created_at.desc())
        .limit(5)
        .all()
    )

    # Build user context string
    skill_summary = ", ".join(
        f"{p.skill.name if p.skill else 'Unknown'}: {round(p.proficiency_score, 0)}%"
        for p in profiles[:4]
    ) if profiles else "No assessments taken yet"

    user_context = f"(User: {current_user.name}, Goal: {current_user.career_goal}, Skills: {skill_summary})"

    # System prompt with real user data
    assessment_dicts = [{"score": r.score, "time_taken_seconds": r.time_taken_seconds or 60} for r in recent_results]
    user_state = ai_service.build_user_state(assessment_dicts)

    system_prompt = f"""You are SkillNova's AI learning assistant, powered by a Multimodal Transformer Knowledge Tracing (MT-KT) model.

Student Profile:
- Name: {current_user.name}
- Career Goal: {current_user.career_goal or 'AI Engineer'}
- Location: {current_user.location or 'India'}
- Skill Proficiencies: {skill_summary}
- Current Focus Level: {round(user_state['affect_focus'] * 100)}%
- Avg Assessment Score: {round(user_state['avg_correctness'] * 100)}%

You have real data about this student's learning trajectory from our MT-KT model.
Give personalized, actionable advice. Be concise (2-3 sentences). 
Reference specific skills and scores when relevant. Be encouraging but honest."""

    # Build message history
    messages = []
    for msg in (data.conversation_history or [])[-6:]:
        messages.append({"role": msg.get("role", "user"), "content": msg.get("content", "")})
    messages.append({"role": "user", "content": data.message})

    # Get LLM response
    response = await call_llm(system_prompt, messages, user_context)

    # Generate contextual suggestions
    suggestions = _get_suggestions(data.message, user_state, profiles)

    return ChatResponse(
        response=response,
        suggestions=suggestions,
        action_type=_detect_action_type(data.message),
    )


def _get_suggestions(message: str, user_state: Dict, profiles) -> List[str]:
    msg = message.lower()
    if "course" in msg or "recommend" in msg:
        return ["Show my top courses", "Filter by free courses", "View govt certified courses"]
    elif "skill" in msg or "assess" in msg:
        return ["Take Python assessment", "View skill gaps", "See my progress chart"]
    elif "path" in msg or "plan" in msg:
        return ["View my learning path", "Update my schedule", "See next milestone"]
    else:
        return ["What should I learn next?", "Analyze my skill gaps", "Create a study plan"]


def _detect_action_type(message: str) -> str:
    msg = message.lower()
    if any(w in msg for w in ["course", "recommend"]):
        return "navigate_recommendations"
    elif any(w in msg for w in ["assess", "test", "quiz"]):
        return "navigate_assessment"
    elif any(w in msg for w in ["path", "plan"]):
        return "navigate_learning_path"
    return "chat"
