from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    location = Column(String(100), nullable=True)
    career_goal = Column(String(100), nullable=True, default="AI Engineer")
    avatar_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    streak_days = Column(Integer, default=0)
    total_xp = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    assessments = relationship("AssessmentResult", back_populates="user")
    enrollments = relationship("Enrollment", back_populates="user")
    learning_sessions = relationship("LearningSession", back_populates="user")
    skill_profiles = relationship("UserSkillProfile", back_populates="user")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    difficulty_level = Column(String(20), default="Intermediate")

    questions = relationship("AssessmentQuestion", back_populates="skill")
    user_profiles = relationship("UserSkillProfile", back_populates="skill")


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    option_a = Column(String(500), nullable=False)
    option_b = Column(String(500), nullable=False)
    option_c = Column(String(500), nullable=False)
    option_d = Column(String(500), nullable=False)
    correct_answer = Column(String(1), nullable=False)  # A, B, C, or D
    difficulty = Column(String(20), default="Intermediate")
    explanation = Column(Text, nullable=True)

    skill = relationship("Skill", back_populates="questions")


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    score = Column(Float, nullable=False)
    total_questions = Column(Integer, nullable=False)
    time_taken_seconds = Column(Integer, nullable=True)
    affective_state = Column(JSON, nullable=True)  # {focus, frustration, confusion, boredom}
    responses = Column(JSON, nullable=True)  # list of {question_id, answer, correct, time}
    mastery_probability = Column(Float, nullable=True)  # MT-KT prediction
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="assessments")
    skill = relationship("Skill")


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    provider = Column(String(100), nullable=False)
    instructor = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    duration_weeks = Column(Integer, nullable=True)
    level = Column(String(30), default="Intermediate")
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    enrolled_count = Column(Integer, default=0)
    price = Column(String(50), default="Free")
    url = Column(String(500), nullable=True)
    thumbnail_color = Column(String(50), default="#6366f1")
    is_govt_certified = Column(Boolean, default=False)
    tags = Column(JSON, nullable=True)
    skill_ids = Column(JSON, nullable=True)  # list of skill IDs this course covers
    start_date = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    enrollments = relationship("Enrollment", back_populates="course")


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    progress_percent = Column(Float, default=0.0)
    completed = Column(Boolean, default=False)
    enrolled_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")


class UserSkillProfile(Base):
    __tablename__ = "user_skill_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    proficiency_score = Column(Float, default=0.0)  # 0-100
    mastery_probability = Column(Float, default=0.0)  # from MT-KT model
    last_assessed = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", back_populates="skill_profiles")
    skill = relationship("Skill", back_populates="user_profiles")


class LearningSession(Base):
    __tablename__ = "learning_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime(timezone=True), server_default=func.now())
    hours_spent = Column(Float, default=0.0)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=True)
    activity_type = Column(String(50), default="study")  # study, assessment, course

    user = relationship("User", back_populates="learning_sessions")


class LearningPath(Base):
    __tablename__ = "learning_paths"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    career_goal = Column(String(100), nullable=False)
    phases = Column(JSON, nullable=False)  # list of phases with modules
    total_weeks = Column(Integer, default=24)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class UserLearningPath(Base):
    __tablename__ = "user_learning_paths"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    path_id = Column(Integer, ForeignKey("learning_paths.id"), nullable=False)
    progress_percent = Column(Float, default=0.0)
    current_phase = Column(Integer, default=1)
    is_active = Column(Boolean, default=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
