"""courses.py"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User, Course, Enrollment

router = APIRouter()


@router.get("")
def get_courses(
    govt_only: bool = False,
    level: str = None,
    db: Session = Depends(get_db),
):
    query = db.query(Course)
    if govt_only:
        query = query.filter(Course.is_govt_certified == True)
    if level:
        query = query.filter(Course.level == level)
    courses = query.all()
    return [
        {
            "id": c.id, "title": c.title, "provider": c.provider,
            "instructor": c.instructor, "description": c.description,
            "duration_weeks": c.duration_weeks, "level": c.level,
            "rating": c.rating, "review_count": c.review_count,
            "enrolled_count": c.enrolled_count, "price": c.price,
            "url": c.url, "is_govt_certified": c.is_govt_certified,
            "tags": c.tags or [], "start_date": c.start_date,
        }
        for c in courses
    ]


@router.post("/{course_id}/enroll")
def enroll(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()
    if existing:
        return {"message": "Already enrolled", "enrollment_id": existing.id}

    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Course not found")

    enrollment = Enrollment(user_id=current_user.id, course_id=course_id)
    db.add(enrollment)
    course.enrolled_count = (course.enrolled_count or 0) + 1
    db.commit()
    db.refresh(enrollment)
    return {"message": "Enrolled successfully", "enrollment_id": enrollment.id}


@router.get("/enrolled")
def get_enrolled(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    enrollments = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id
    ).all()
    return [
        {
            "course_id": e.course_id,
            "title": e.course.title if e.course else "",
            "provider": e.course.provider if e.course else "",
            "progress_percent": round(e.progress_percent, 1),
            "completed": e.completed,
        }
        for e in enrollments
    ]
