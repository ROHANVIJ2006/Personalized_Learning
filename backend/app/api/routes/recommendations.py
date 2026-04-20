from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, Course, AssessmentResult, UserSkillProfile
from app.services.ai_service import ai_service

router = APIRouter()


@router.get("")
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    DQN-powered personalized course recommendations.
    1. Build user state from assessment history
    2. Run DQN agent to rank courses
    3. Return ranked courses with match scores + AI insight
    """
    # Get user's recent assessment results
    recent_results = (
        db.query(AssessmentResult)
        .filter(AssessmentResult.user_id == current_user.id)
        .order_by(AssessmentResult.created_at.desc())
        .limit(10)
        .all()
    )

    assessment_dicts = [
        {
            "score": r.score,
            "time_taken_seconds": r.time_taken_seconds or 60,
            "affective_state": r.affective_state or {},
        }
        for r in recent_results
    ]

    # Build 6-dim DQN state
    user_state = ai_service.build_user_state(assessment_dicts)

    # Get all courses
    all_courses = db.query(Course).all()  # joinedload not needed here - no relationships accessed
    course_ids = [c.id for c in all_courses]

    # DQN recommendation
    ranked = ai_service.get_course_recommendations(user_state, course_ids, top_k=8)
    ranked_map = {r["course_id"]: r for r in ranked}

    # Get skill profiles for gap analysis
    skill_profiles = (
        db.query(UserSkillProfile)
        .options(joinedload(UserSkillProfile.skill))
        .filter(UserSkillProfile.user_id == current_user.id)
        .all()
    )

    skill_gaps = [
        {
            "skill_id": sp.skill_id,
            "skill_name": sp.skill.name if sp.skill else "Unknown",
            "proficiency": round(sp.proficiency_score, 1),
            "mastery_probability": round(sp.mastery_probability or 0, 3),
            "gap": round(100 - sp.proficiency_score, 1),
        }
        for sp in skill_profiles
        if sp.proficiency_score < 80
    ]
    skill_gaps.sort(key=lambda x: x["gap"], reverse=True)

    # Build response
    result_courses = []
    for course in all_courses:
        rec = ranked_map.get(course.id, {})
        match_score = rec.get("score", 0.0)
        # Normalize to 50-99 range for UI
        if match_score != 0:
            match_pct = round(50 + (match_score + 1) / 2 * 49, 0)
        else:
            # Heuristic fallback by position
            idx = course_ids.index(course.id) if course.id in course_ids else 99
            match_pct = max(50, 98 - idx * 3)

        result_courses.append({
            "id": course.id,
            "title": course.title,
            "provider": course.provider,
            "instructor": course.instructor,
            "description": course.description,
            "duration_weeks": course.duration_weeks,
            "level": course.level,
            "rating": course.rating,
            "review_count": course.review_count,
            "enrolled_count": course.enrolled_count,
            "price": course.price,
            "url": course.url,
            "is_govt_certified": course.is_govt_certified,
            "tags": course.tags or [],
            "match_score": int(match_pct),
            "reason": rec.get("reason", "Aligned with your learning profile"),
        })

    result_courses.sort(key=lambda x: x["match_score"], reverse=True)

    # AI insight
    ai_insight = ai_service.get_ai_insight(user_state, skill_gaps)

    return {
        "courses": result_courses,
        "ai_insight": {
            "message": ai_insight,
            "focus": skill_gaps[0]["skill_name"] if skill_gaps else "Your learning path",
            "impact": f"{min(int(user_state['affect_focus'] * 100), 95)}% engagement score",
        },
        "user_state": {
            "avg_correctness": round(user_state["avg_correctness"] * 100, 1),
            "focus_level": round(user_state["affect_focus"] * 100, 1),
            "frustration_level": round(user_state["affect_frustration"] * 100, 1),
        },
        "skill_gaps": skill_gaps[:5],
        "next_action": f"Focus on {skill_gaps[0]['skill_name']}" if skill_gaps else "Keep up the great work!",
    }
