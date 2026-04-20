"""progress.py — Skill progress and dashboard data."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timedelta

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import (
    User, UserSkillProfile, Skill, LearningSession,
    AssessmentResult, Enrollment, UserLearningPath, LearningPath
)

router = APIRouter()


@router.get("/dashboard")
def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Full dashboard data - replaces all mock data."""

    # Skill profiles
    profiles = (
        db.query(UserSkillProfile)
        .options(joinedload(UserSkillProfile.skill))
        .filter(UserSkillProfile.user_id == current_user.id)
        .all()
    )

    skill_data = []
    for p in profiles:
        skill = db.query(Skill).filter(Skill.id == p.skill_id).first()
        if skill:
            skill_data.append({
                "skill_name": skill.name,
                "proficiency": round(p.proficiency_score, 1),
                "mastery_probability": round(p.mastery_probability or 0, 3),
                "category": skill.category,
            })

    # Weekly learning hours (last 7 days)
    weekly = []
    for i in range(6, -1, -1):
        day = datetime.utcnow() - timedelta(days=i)
        sessions = (
            db.query(LearningSession)
            .filter(
                LearningSession.user_id == current_user.id,
                LearningSession.date >= day.replace(hour=0, minute=0, second=0),
                LearningSession.date < day.replace(hour=23, minute=59, second=59),
            )
            .all()
        )
        total_hours = sum(s.hours_spent for s in sessions)
        weekly.append({"day": day.strftime("%a"), "hours": round(total_hours, 1)})

    # Overall progress
    overall = (
        sum(p.proficiency_score for p in profiles) / len(profiles)
        if profiles else 0
    )

    # Recent enrollments
    enrollments = (
        db.query(Enrollment)
        .filter(Enrollment.user_id == current_user.id)
        .order_by(Enrollment.enrolled_at.desc())
        .limit(3)
        .all()
    )

    recent_courses = [
        {
            "id": e.course.id,
            "title": e.course.title,
            "provider": e.course.provider,
            "progress_percent": round(e.progress_percent, 1),
            "level": e.course.level,
        }
        for e in enrollments
        if e.course
    ]

    return {
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "career_goal": current_user.career_goal,
            "streak_days": current_user.streak_days or 0,
            "total_xp": current_user.total_xp or 0,
        },
        "overall_progress": round(overall, 1),
        "streak_days": current_user.streak_days or 0,
        "weekly_hours": weekly,
        "skill_profiles": skill_data,
        "recent_courses": recent_courses,
    }


@router.get("/skills")
def get_skill_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Detailed skill progress with history."""
    profiles = (
        db.query(UserSkillProfile)
        .options(joinedload(UserSkillProfile.skill))
        .filter(UserSkillProfile.user_id == current_user.id)
        .all()
    )

    result = []
    for p in profiles:
        skill = db.query(Skill).filter(Skill.id == p.skill_id).first()
        if not skill:
            continue

        # Assessment history for this skill
        history = (
            db.query(AssessmentResult)
            .filter(
                AssessmentResult.user_id == current_user.id,
                AssessmentResult.skill_id == p.skill_id,
            )
            .order_by(AssessmentResult.created_at)
            .all()
        )

        result.append({
            "skill_id": p.skill_id,
            "skill_name": skill.name,
            "category": skill.category,
            "current_score": round(p.proficiency_score, 1),
            "target_score": min(p.proficiency_score + 15, 100),
            "mastery_probability": round(p.mastery_probability or 0, 3),
            "improvement": round(p.proficiency_score - (history[0].score * 100 if history else p.proficiency_score), 1),
            "assessment_count": len(history),
            "score_history": [
                {"date": r.created_at.strftime("%b %d"), "score": round(r.score * 100, 1)}
                for r in history[-6:]
            ],
        })

    return result


@router.get("/monthly")
def get_monthly_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Monthly aggregate score for progress chart."""
    monthly = []
    for i in range(5, -1, -1):
        month_start = datetime.utcnow().replace(day=1) - timedelta(days=30 * i)
        month_end = month_start + timedelta(days=30)

        results = (
            db.query(AssessmentResult)
            .filter(
                AssessmentResult.user_id == current_user.id,
                AssessmentResult.created_at >= month_start,
                AssessmentResult.created_at < month_end,
            )
            .all()
        )

        avg_score = (
            sum(r.score for r in results) / len(results) * 100
            if results else None
        )
        monthly.append({
            "month": month_start.strftime("%b"),
            "score": round(avg_score, 1) if avg_score else None,
            "count": len(results),
        })

    return monthly
