from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
import time

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import (
    User, Skill, AssessmentQuestion, AssessmentResult,
    UserSkillProfile, LearningSession
)
from app.schemas.schemas import (
    AssessmentStartRequest, AssessmentSubmitRequest,
    AssessmentResultOut, QuestionOut
)
from app.services.ai_service import ai_service

router = APIRouter()


@router.get("/skills")
def get_skills(db: Session = Depends(get_db)):
    """List all available skills with question counts."""
    skills = db.query(Skill).all()
    result = []
    for s in skills:
        q_count = db.query(AssessmentQuestion).filter(
            AssessmentQuestion.skill_id == s.id
        ).count()
        # Get user's last assessment if any
        result.append({
            "id": s.id,
            "name": s.name,
            "category": s.category,
            "difficulty_level": s.difficulty_level,
            "question_count": q_count,
        })
    return result


@router.post("/start")
def start_assessment(
    data: AssessmentStartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return questions for a skill assessment."""
    skill = db.query(Skill).filter(Skill.id == data.skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    questions = (
        db.query(AssessmentQuestion)
        .filter(AssessmentQuestion.skill_id == data.skill_id)
        .limit(10)
        .all()
    )
    if not questions:
        raise HTTPException(status_code=404, detail="No questions available for this skill")

    return {
        "skill_id": skill.id,
        "skill_name": skill.name,
        "difficulty": skill.difficulty_level,
        "time_limit_minutes": 30,
        "questions": [
            {
                "id": q.id,
                "question_text": q.question_text,
                "option_a": q.option_a,
                "option_b": q.option_b,
                "option_c": q.option_c,
                "option_d": q.option_d,
                "difficulty": q.difficulty,
            }
            for q in questions
        ],
    }


@router.post("/submit")
def submit_assessment(
    data: AssessmentSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Submit assessment answers.
    - Grades responses against DB
    - Runs MT-KT model to predict mastery probability
    - Updates UserSkillProfile
    - Returns score + AI-powered recommendations
    """
    skill = db.query(Skill).filter(Skill.id == data.skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    # Grade each response
    graded = []
    correct_count = 0
    total_time = 0

    for resp in data.responses:
        q = db.query(AssessmentQuestion).filter(
            AssessmentQuestion.id == resp["question_id"]
        ).first()
        if not q:
            continue
        is_correct = resp.get("answer", "").upper() == q.correct_answer.upper()
        if is_correct:
            correct_count += 1
        time_taken = resp.get("time_taken_seconds", 30)
        total_time += time_taken
        graded.append({
            "question_id": q.id,
            "answer": resp.get("answer", ""),
            "correct": 1 if is_correct else 0,
            "correct_answer": q.correct_answer,
            "explanation": q.explanation,
            "time_taken_seconds": time_taken,
        })

    total_questions = len(graded) or 1
    score_pct = correct_count / total_questions

    # Estimate affective state from response patterns
    times = [r["time_taken_seconds"] for r in graded]
    avg_time = sum(times) / len(times) if times else 30
    correct_flags = [r["correct"] for r in graded]

    # Build interaction history for MT-KT
    interactions = [
        {
            "skill_id": data.skill_id,
            "correct": r["correct"],
            "response_time": r["time_taken_seconds"],
            "affect_focus": min(0.4 + score_pct * 0.6, 1.0),
            "affect_frustration": max(0.0, (1 - score_pct) * 0.7),
            "affect_confusion": max(0.0, (1 - score_pct) * 0.5),
            "affect_boredom": score_pct * 0.1,
        }
        for r in graded
    ]

    # Get previous interactions for this user/skill
    prev_results = (
        db.query(AssessmentResult)
        .filter(
            AssessmentResult.user_id == current_user.id,
            AssessmentResult.skill_id == data.skill_id,
        )
        .order_by(AssessmentResult.created_at.desc())
        .limit(5)
        .all()
    )
    for prev in prev_results:
        if prev.responses:
            interactions = prev.responses + interactions

    # MT-KT mastery prediction
    mastery_result = ai_service.predict_mastery(interactions, skill.name)
    mastery_prob = mastery_result["mastery_probability"]

    # Affective state summary
    affective_state = {
        "focus": min(0.4 + score_pct * 0.6, 1.0),
        "frustration": max(0.0, (1 - score_pct) * 0.7),
        "confusion": max(0.0, (1 - score_pct) * 0.5),
        "boredom": score_pct * 0.1,
    }

    # Save result
    result = AssessmentResult(
        user_id=current_user.id,
        skill_id=data.skill_id,
        score=score_pct,
        total_questions=total_questions,
        time_taken_seconds=total_time,
        affective_state=affective_state,
        responses=graded,
        mastery_probability=mastery_prob,
    )
    db.add(result)

    # Update or create skill profile
    profile = (
        db.query(UserSkillProfile)
        .filter(
            UserSkillProfile.user_id == current_user.id,
            UserSkillProfile.skill_id == data.skill_id,
        )
        .first()
    )
    if profile:
        # Exponential moving average
        profile.proficiency_score = 0.3 * profile.proficiency_score + 0.7 * (score_pct * 100)
        profile.mastery_probability = mastery_prob
    else:
        profile = UserSkillProfile(
            user_id=current_user.id,
            skill_id=data.skill_id,
            proficiency_score=score_pct * 100,
            mastery_probability=mastery_prob,
        )
        db.add(profile)

    # Log session
    session = LearningSession(
        user_id=current_user.id,
        skill_id=data.skill_id,
        hours_spent=total_time / 3600,
        activity_type="assessment",
    )
    db.add(session)

    # Update XP
    xp_gained = int(correct_count * 10 + (mastery_prob * 50))
    current_user.total_xp = (current_user.total_xp or 0) + xp_gained

    db.commit()
    db.refresh(result)

    # Generate recommendations
    recommendations = _generate_recommendations(score_pct, skill.name, mastery_prob)

    return {
        "skill_name": skill.name,
        "score": correct_count,
        "total_questions": total_questions,
        "percentage": round(score_pct * 100, 1),
        "mastery_probability": round(mastery_prob, 3),
        "affective_state": affective_state,
        "graded_responses": graded,
        "xp_gained": xp_gained,
        "recommendations": recommendations,
        "ai_insight": mastery_result.get("confidence", "medium"),
    }


def _generate_recommendations(score: float, skill_name: str, mastery: float) -> List[str]:
    if score >= 0.9:
        return [
            f"Excellent! You've demonstrated strong mastery of {skill_name}.",
            "Consider attempting Advanced level topics next.",
            "You're ready to take on real-world projects in this area.",
        ]
    elif score >= 0.7:
        return [
            f"Good performance in {skill_name}! A few areas need more practice.",
            "Review the questions you got wrong and study the explanations.",
            "Practice with 2-3 more exercises to solidify your knowledge.",
        ]
    elif score >= 0.5:
        return [
            f"You have a basic understanding of {skill_name} but gaps remain.",
            "Focus on the foundational concepts before advancing.",
            "Watch video lectures and retry the assessment in 3-4 days.",
        ]
    else:
        return [
            f"This area needs significant work. Start with {skill_name} basics.",
            "Enroll in a beginner-level course to build your foundation.",
            "Practice daily exercises and track your progress over 2 weeks.",
        ]


@router.get("/history")
def get_assessment_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's assessment history."""
    results = (
        db.query(AssessmentResult)
        .options(joinedload(AssessmentResult.skill))
        .filter(AssessmentResult.user_id == current_user.id)
        .order_by(AssessmentResult.created_at.desc())
        .limit(20)
        .all()
    )
    return [
        {
            "id": r.id,
            "skill_name": r.skill.name if r.skill else "Unknown",
            "score": round(r.score * 100, 1),
            "total_questions": r.total_questions,
            "mastery_probability": round(r.mastery_probability or 0, 3),
            "created_at": r.created_at,
        }
        for r in results
    ]
