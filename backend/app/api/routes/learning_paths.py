"""learning_paths.py"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, LearningPath, UserLearningPath

router = APIRouter()


@router.get("")
def get_learning_paths(db: Session = Depends(get_db)):
    paths = db.query(LearningPath).all()
    return [
        {
            "id": p.id, "title": p.title, "career_goal": p.career_goal,
            "description": p.description, "total_weeks": p.total_weeks,
            "phases": p.phases,
        }
        for p in paths
    ]


@router.get("/my")
def get_my_path(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ulp = (
        db.query(UserLearningPath)
        .filter(UserLearningPath.user_id == current_user.id, UserLearningPath.is_active == True)
        .first()
    )
    if not ulp:
        # Auto-assign based on career_goal
        path = db.query(LearningPath).filter(
            LearningPath.career_goal == (current_user.career_goal or "AI Engineer")
        ).first()
        if not path:
            path = db.query(LearningPath).first()
        if path:
            ulp = UserLearningPath(
                user_id=current_user.id,
                path_id=path.id,
                progress_percent=0.0,
                current_phase=1,
            )
            db.add(ulp)
            db.commit()
            db.refresh(ulp)
        else:
            return {"error": "No learning paths available. Run seed_database.py first."}

    path = db.query(LearningPath).filter(LearningPath.id == ulp.path_id).first()

    # Build weekly schedule based on current phase
    days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    tasks = ["Theory Study", "Practice Problems", "Coding Exercise", "Project Work", "Review & Quiz"]
    times = ["2h", "1.5h", "2h", "3h", "1h"]
    weekly_schedule = [
        {"day": d, "task": t, "time": tm, "completed": i < 2}
        for i, (d, t, tm) in enumerate(zip(days, tasks, times))
    ]

    return {
        "id": path.id,
        "title": path.title,
        "career_goal": path.career_goal,
        "progress_percent": round(ulp.progress_percent, 1),
        "current_phase": ulp.current_phase,
        "phases": path.phases,
        "weekly_schedule": weekly_schedule,
        "total_weeks": path.total_weeks,
    }
