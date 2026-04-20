"""
seed_database.py — Seed the database with real skills, questions, and courses.
Run once after setting up: python seed_database.py
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine, Base
from app.models.user import (
    Skill, AssessmentQuestion, Course, LearningPath, User
)
from app.core.security import get_password_hash
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


SKILLS = [
    {"name": "Python Programming", "category": "Programming", "difficulty_level": "Intermediate"},
    {"name": "Machine Learning", "category": "AI/ML", "difficulty_level": "Advanced"},
    {"name": "Deep Learning", "category": "AI/ML", "difficulty_level": "Advanced"},
    {"name": "React Development", "category": "Web Development", "difficulty_level": "Intermediate"},
    {"name": "SQL & Databases", "category": "Database", "difficulty_level": "Beginner"},
    {"name": "Data Structures", "category": "Computer Science", "difficulty_level": "Advanced"},
    {"name": "Cloud Computing", "category": "Cloud", "difficulty_level": "Intermediate"},
    {"name": "Natural Language Processing", "category": "AI/ML", "difficulty_level": "Advanced"},
    {"name": "Computer Vision", "category": "AI/ML", "difficulty_level": "Advanced"},
    {"name": "Statistics & Probability", "category": "Mathematics", "difficulty_level": "Intermediate"},
]

QUESTIONS = {
    "Python Programming": [
        {
            "question_text": "What is the output of: list(map(lambda x: x**2, [1,2,3]))?",
            "option_a": "[1, 4, 9]",
            "option_b": "[2, 4, 6]",
            "option_c": "[1, 2, 3]",
            "option_d": "Error",
            "correct_answer": "A",
            "difficulty": "Intermediate",
            "explanation": "map applies the lambda to each element, squaring each: 1→1, 2→4, 3→9.",
        },
        {
            "question_text": "Which of the following creates a generator in Python?",
            "option_a": "def gen(): return [x for x in range(10)]",
            "option_b": "def gen(): yield from range(10)",
            "option_c": "gen = list(range(10))",
            "option_d": "gen = {x for x in range(10)}",
            "correct_answer": "B",
            "difficulty": "Intermediate",
            "explanation": "yield from creates a generator. return with a list is a normal function.",
        },
        {
            "question_text": "What does the @property decorator do?",
            "option_a": "Makes a method static",
            "option_b": "Allows a method to be accessed like an attribute",
            "option_c": "Makes a method private",
            "option_d": "Caches the method result",
            "correct_answer": "B",
            "difficulty": "Intermediate",
            "explanation": "@property turns a method into a read-only attribute.",
        },
        {
            "question_text": "What is the time complexity of dict lookup in Python?",
            "option_a": "O(n)",
            "option_b": "O(log n)",
            "option_c": "O(1) average",
            "option_d": "O(n log n)",
            "correct_answer": "C",
            "difficulty": "Intermediate",
            "explanation": "Python dicts use hash tables, giving O(1) average-case lookup.",
        },
        {
            "question_text": "Which method is called when an object is created in Python?",
            "option_a": "__create__",
            "option_b": "__new__",
            "option_c": "__init__",
            "option_d": "__build__",
            "correct_answer": "C",
            "difficulty": "Beginner",
            "explanation": "__init__ is the initializer called after __new__ allocates memory.",
        },
        {
            "question_text": "What does 'with open(\"f\") as f' ensure?",
            "option_a": "File is read-only",
            "option_b": "File is automatically closed after the block",
            "option_c": "File is opened in binary mode",
            "option_d": "File is buffered in memory",
            "correct_answer": "B",
            "difficulty": "Beginner",
            "explanation": "Context managers ensure __exit__ is called, closing the file.",
        },
        {
            "question_text": "What is a Python decorator?",
            "option_a": "A design pattern for inheritance",
            "option_b": "A function that wraps another function to modify behavior",
            "option_c": "A way to declare class variables",
            "option_d": "A built-in for string formatting",
            "correct_answer": "B",
            "difficulty": "Intermediate",
            "explanation": "Decorators are higher-order functions that modify wrapped functions.",
        },
        {
            "question_text": "What is GIL in Python?",
            "option_a": "Global Index List",
            "option_b": "Global Interpreter Lock — prevents true multi-threading",
            "option_c": "Garbage Integration Layer",
            "option_d": "Generic Import Library",
            "correct_answer": "B",
            "difficulty": "Advanced",
            "explanation": "GIL allows only one thread to execute Python bytecode at a time.",
        },
        {
            "question_text": "What does collections.defaultdict do?",
            "option_a": "Prevents duplicate keys",
            "option_b": "Provides a default value for missing keys",
            "option_c": "Sorts the dictionary",
            "option_d": "Creates an ordered dictionary",
            "correct_answer": "B",
            "difficulty": "Intermediate",
            "explanation": "defaultdict(int) returns 0 for missing keys instead of raising KeyError.",
        },
        {
            "question_text": "What is the difference between deepcopy and copy?",
            "option_a": "No difference",
            "option_b": "deepcopy copies nested objects recursively",
            "option_c": "copy is faster than deepcopy",
            "option_d": "deepcopy only works with lists",
            "correct_answer": "B",
            "difficulty": "Intermediate",
            "explanation": "copy.copy is shallow (references shared); deepcopy recursively copies all nested objects.",
        },
    ],
    "Machine Learning": [
        {
            "question_text": "Which algorithm minimizes the sum of squared residuals?",
            "option_a": "Logistic Regression",
            "option_b": "Linear Regression (OLS)",
            "option_c": "Decision Tree",
            "option_d": "K-Means",
            "correct_answer": "B",
            "difficulty": "Beginner",
            "explanation": "OLS linear regression minimizes the sum of squared differences between predictions and actuals.",
        },
        {
            "question_text": "What does 'bias-variance tradeoff' mean?",
            "option_a": "Choosing between accuracy and speed",
            "option_b": "Balancing underfitting (bias) and overfitting (variance)",
            "option_c": "Selecting the best feature",
            "option_d": "Tradeoff between training and test accuracy",
            "correct_answer": "B",
            "difficulty": "Intermediate",
            "explanation": "High bias → underfits. High variance → overfits. Optimal models balance both.",
        },
        {
            "question_text": "What does the kernel trick in SVMs enable?",
            "option_a": "Faster training",
            "option_b": "Classification in higher-dimensional feature spaces without explicit transformation",
            "option_c": "Handling missing values",
            "option_d": "Multi-class classification",
            "correct_answer": "B",
            "difficulty": "Advanced",
            "explanation": "Kernels compute dot products in high-dimensional space efficiently using the kernel function.",
        },
        {
            "question_text": "In gradient boosting, what does each tree learn?",
            "option_a": "A random subset of data",
            "option_b": "The residual errors of the previous tree",
            "option_c": "The full training data independently",
            "option_d": "A random feature subset",
            "correct_answer": "B",
            "difficulty": "Advanced",
            "explanation": "Each tree in gradient boosting fits the negative gradient of the loss (residuals).",
        },
        {
            "question_text": "What metric is best for imbalanced classification?",
            "option_a": "Accuracy",
            "option_b": "F1-Score or AUC-ROC",
            "option_c": "MSE",
            "option_d": "R²",
            "correct_answer": "B",
            "difficulty": "Intermediate",
            "explanation": "Accuracy is misleading on imbalanced data. F1 and AUC-ROC better capture minority class performance.",
        },
        {
            "question_text": "What is cross-validation used for?",
            "option_a": "Speeding up training",
            "option_b": "Estimating model generalization on unseen data",
            "option_c": "Feature selection",
            "option_d": "Hyperparameter initialization",
            "correct_answer": "B",
            "difficulty": "Beginner",
            "explanation": "K-fold CV splits data into K folds to estimate how well a model generalizes.",
        },
        {
            "question_text": "What does regularization (L1/L2) do?",
            "option_a": "Speeds up convergence",
            "option_b": "Penalizes large weights to reduce overfitting",
            "option_c": "Normalizes input features",
            "option_d": "Selects learning rate",
            "correct_answer": "B",
            "difficulty": "Intermediate",
            "explanation": "L1 (Lasso) encourages sparsity; L2 (Ridge) penalizes large weights uniformly.",
        },
        {
            "question_text": "What is the 'elbow method' used for?",
            "option_a": "Selecting number of trees in random forest",
            "option_b": "Choosing optimal K in K-Means clustering",
            "option_c": "Setting learning rate",
            "option_d": "Feature importance ranking",
            "correct_answer": "B",
            "difficulty": "Intermediate",
            "explanation": "The elbow method plots inertia vs K; the 'elbow' indicates diminishing returns.",
        },
        {
            "question_text": "What is transfer learning?",
            "option_a": "Moving model to a new server",
            "option_b": "Applying a pre-trained model's knowledge to a new task",
            "option_c": "Training on multiple datasets",
            "option_d": "Transferring data between databases",
            "correct_answer": "B",
            "difficulty": "Advanced",
            "explanation": "Transfer learning reuses representations learned on large datasets (e.g., ImageNet) for new tasks.",
        },
        {
            "question_text": "What is a confusion matrix?",
            "option_a": "A matrix of correlated features",
            "option_b": "A table showing TP, FP, TN, FN for classifier evaluation",
            "option_c": "A weight initialization strategy",
            "option_d": "A dimensionality reduction technique",
            "correct_answer": "B",
            "difficulty": "Beginner",
            "explanation": "Confusion matrices show how many predictions fall into each category of correct/incorrect.",
        },
    ],
    "SQL & Databases": [
        {
            "question_text": "What does ACID stand for in databases?",
            "option_a": "Atomicity, Consistency, Isolation, Durability",
            "option_b": "Accuracy, Concurrency, Integration, Data",
            "option_c": "Automatic, Cached, Indexed, Distributed",
            "option_d": "Async, Consistent, Isolated, Durable",
            "correct_answer": "A",
            "difficulty": "Intermediate",
            "explanation": "ACID properties guarantee reliable database transactions.",
        },
        {
            "question_text": "What is the difference between INNER JOIN and LEFT JOIN?",
            "option_a": "No difference",
            "option_b": "INNER JOIN returns only matching rows; LEFT JOIN returns all left rows",
            "option_c": "LEFT JOIN is faster",
            "option_d": "INNER JOIN works only on indexed columns",
            "correct_answer": "B",
            "difficulty": "Beginner",
            "explanation": "INNER JOIN: only matched rows. LEFT JOIN: all left table rows + matched right rows (NULL if no match).",
        },
        {
            "question_text": "What does 'GROUP BY' do in SQL?",
            "option_a": "Sorts result by a column",
            "option_b": "Groups rows with same values to apply aggregate functions",
            "option_c": "Filters rows",
            "option_d": "Joins two tables",
            "correct_answer": "B",
            "difficulty": "Beginner",
            "explanation": "GROUP BY aggregates rows with identical values, used with COUNT, SUM, AVG etc.",
        },
        {
            "question_text": "What is a database index?",
            "option_a": "A backup copy of a table",
            "option_b": "A data structure that speeds up data retrieval at the cost of storage",
            "option_c": "A constraint for unique values",
            "option_d": "A foreign key reference",
            "correct_answer": "B",
            "difficulty": "Intermediate",
            "explanation": "Indexes (B-trees, hash) allow O(log n) lookups instead of O(n) full table scans.",
        },
        {
            "question_text": "What is a subquery?",
            "option_a": "A query stored as a view",
            "option_b": "A query nested inside another query",
            "option_c": "A faster version of a join",
            "option_d": "A query on a subset of columns",
            "correct_answer": "B",
            "difficulty": "Intermediate",
            "explanation": "Subqueries (nested queries) run independently and their result is used by the outer query.",
        },
        {
            "question_text": "What does 'HAVING' differ from 'WHERE'?",
            "option_a": "No difference",
            "option_b": "HAVING filters after GROUP BY; WHERE filters before",
            "option_c": "WHERE works only on joins",
            "option_d": "HAVING is used without GROUP BY",
            "correct_answer": "B",
            "difficulty": "Intermediate",
            "explanation": "WHERE filters rows before grouping; HAVING filters groups after GROUP BY.",
        },
        {
            "question_text": "What is normalization in databases?",
            "option_a": "Scaling numeric columns",
            "option_b": "Organizing tables to reduce data redundancy",
            "option_c": "Creating indexes",
            "option_d": "Encrypting data",
            "correct_answer": "B",
            "difficulty": "Intermediate",
            "explanation": "Normalization (1NF, 2NF, 3NF) eliminates redundancy and ensures data integrity.",
        },
        {
            "question_text": "What does a PRIMARY KEY constraint enforce?",
            "option_a": "The column must be an integer",
            "option_b": "Uniqueness and non-null values for each row",
            "option_c": "The column is auto-incremented",
            "option_d": "Foreign key references",
            "correct_answer": "B",
            "difficulty": "Beginner",
            "explanation": "Primary keys enforce unique + NOT NULL; each table can have only one.",
        },
        {
            "question_text": "What is a CTE (Common Table Expression)?",
            "option_a": "A type of index",
            "option_b": "A temporary named result set defined in a WITH clause",
            "option_c": "A stored procedure",
            "option_d": "A database trigger",
            "correct_answer": "B",
            "difficulty": "Advanced",
            "explanation": "CTEs (WITH clause) define temporary result sets reusable in the same query.",
        },
        {
            "question_text": "What does 'EXPLAIN' do in SQL?",
            "option_a": "Documents the query",
            "option_b": "Shows the query execution plan and cost",
            "option_c": "Creates a view",
            "option_d": "Exports query results",
            "correct_answer": "B",
            "difficulty": "Advanced",
            "explanation": "EXPLAIN reveals how the database engine executes a query, showing indexes and join strategies used.",
        },
    ],
}

COURSES = [
    {
        "title": "Deep Learning Specialization",
        "provider": "Coursera",
        "instructor": "Andrew Ng",
        "description": "Master deep learning, improve your understanding of neural networks, and build cutting-edge AI projects.",
        "duration_weeks": 12,
        "level": "Intermediate",
        "rating": 4.9,
        "review_count": 125842,
        "enrolled_count": 450000,
        "price": "Free to audit",
        "url": "https://www.coursera.org/specializations/deep-learning",
        "is_govt_certified": False,
        "tags": ["AI/ML", "Deep Learning", "Neural Networks"],
    },
    {
        "title": "Machine Learning with Python",
        "provider": "NPTEL",
        "instructor": "Prof. Balaraman Ravindran, IIT Madras",
        "description": "NPTEL course on ML fundamentals using Python from IIT Madras faculty.",
        "duration_weeks": 12,
        "level": "Intermediate",
        "rating": 4.7,
        "review_count": 45200,
        "enrolled_count": 180000,
        "price": "Free",
        "url": "https://nptel.ac.in/courses/106106139",
        "is_govt_certified": True,
        "tags": ["AI/ML", "Python", "Govt"],
    },
    {
        "title": "Data Structures & Algorithms",
        "provider": "Swayam",
        "instructor": "Prof. Naveen Garg, IIT Delhi",
        "description": "Comprehensive DSA course by IIT Delhi for competitive programming and software engineering.",
        "duration_weeks": 8,
        "level": "Intermediate",
        "rating": 4.9,
        "review_count": 67000,
        "enrolled_count": 280000,
        "price": "Free",
        "url": "https://swayam.gov.in/nd2_cec20_cs13/preview",
        "is_govt_certified": True,
        "tags": ["CS Fundamentals", "Algorithms", "Govt"],
    },
    {
        "title": "Advanced React Patterns",
        "provider": "Frontend Masters",
        "instructor": "Kent C. Dodds",
        "description": "Advanced composition, performance optimization, and professional React patterns.",
        "duration_weeks": 6,
        "level": "Advanced",
        "rating": 4.8,
        "review_count": 28500,
        "enrolled_count": 95000,
        "price": "$39/mo",
        "url": "https://frontendmasters.com/courses/advanced-react-patterns/",
        "is_govt_certified": False,
        "tags": ["Web Dev", "React", "JavaScript"],
    },
    {
        "title": "Cloud Computing Fundamentals",
        "provider": "NPTEL",
        "instructor": "Prof. Soumya Banerjee, IIT KGP",
        "description": "IIT Kharagpur's comprehensive introduction to cloud computing concepts and AWS.",
        "duration_weeks": 10,
        "level": "Beginner",
        "rating": 4.7,
        "review_count": 38400,
        "enrolled_count": 120000,
        "price": "Free",
        "url": "https://nptel.ac.in/courses/106105101",
        "is_govt_certified": True,
        "tags": ["Cloud", "AWS", "Govt"],
    },
    {
        "title": "Full Stack Web Development",
        "provider": "Infosys Springboard",
        "instructor": "Infosys Learning Team",
        "description": "End-to-end full stack development with React, Node.js, and databases.",
        "duration_weeks": 16,
        "level": "Intermediate",
        "rating": 4.5,
        "review_count": 34200,
        "enrolled_count": 220000,
        "price": "Free",
        "url": "https://infyspringboard.onwingspan.com/",
        "is_govt_certified": True,
        "tags": ["Web Dev", "Full Stack", "Govt"],
    },
    {
        "title": "Natural Language Processing with Transformers",
        "provider": "Hugging Face",
        "instructor": "Lewis Tunstall, Leandro von Werra",
        "description": "Practical NLP with the Hugging Face ecosystem, fine-tuning LLMs for real tasks.",
        "duration_weeks": 8,
        "level": "Advanced",
        "rating": 4.8,
        "review_count": 19500,
        "enrolled_count": 85000,
        "price": "Free",
        "url": "https://huggingface.co/course/",
        "is_govt_certified": False,
        "tags": ["AI/ML", "NLP", "Transformers"],
    },
    {
        "title": "Statistics for Data Science",
        "provider": "Swayam",
        "instructor": "Prof. Rajeeva L. Karandikar, CMI",
        "description": "Probability and statistics foundation for data science from Chennai Mathematical Institute.",
        "duration_weeks": 12,
        "level": "Intermediate",
        "rating": 4.6,
        "review_count": 22100,
        "enrolled_count": 95000,
        "price": "Free",
        "url": "https://swayam.gov.in/",
        "is_govt_certified": True,
        "tags": ["Mathematics", "Statistics", "Govt"],
    },
    {
        "title": "Computer Vision with PyTorch",
        "provider": "fast.ai",
        "instructor": "Jeremy Howard",
        "description": "Practical deep learning for computer vision using the fast.ai library and PyTorch.",
        "duration_weeks": 7,
        "level": "Advanced",
        "rating": 4.9,
        "review_count": 42000,
        "enrolled_count": 160000,
        "price": "Free",
        "url": "https://course.fast.ai/",
        "is_govt_certified": False,
        "tags": ["AI/ML", "Computer Vision", "PyTorch"],
    },
    {
        "title": "Introduction to Machine Learning",
        "provider": "Swayam",
        "instructor": "Prof. Sudeshna Sarkar, IIT Kharagpur",
        "description": "Foundational ML course from IIT Kharagpur covering classical algorithms.",
        "duration_weeks": 8,
        "level": "Beginner",
        "rating": 4.6,
        "review_count": 31000,
        "enrolled_count": 145000,
        "price": "Free",
        "url": "https://swayam.gov.in/nd1_noc19_cs47/preview",
        "is_govt_certified": True,
        "tags": ["AI/ML", "Beginner", "Govt"],
    },
]

LEARNING_PATHS = [
    {
        "title": "AI Engineer",
        "career_goal": "AI Engineer",
        "description": "Become a professional AI/ML engineer with hands-on expertise",
        "total_weeks": 28,
        "phases": [
            {
                "phase": 1, "title": "Programming Fundamentals", "status": "completed",
                "duration": "4 weeks",
                "modules": [
                    {"name": "Python Basics", "completed": True},
                    {"name": "Data Structures", "completed": True},
                    {"name": "Algorithms", "completed": True},
                    {"name": "OOP Concepts", "completed": True},
                ]
            },
            {
                "phase": 2, "title": "Machine Learning Basics", "status": "in-progress",
                "duration": "6 weeks",
                "modules": [
                    {"name": "Linear Regression", "completed": True},
                    {"name": "Classification", "completed": True},
                    {"name": "Decision Trees", "completed": False},
                    {"name": "Neural Networks Intro", "completed": False},
                ]
            },
            {
                "phase": 3, "title": "Deep Learning", "status": "locked",
                "duration": "8 weeks",
                "modules": [
                    {"name": "CNNs", "completed": False},
                    {"name": "RNNs & LSTMs", "completed": False},
                    {"name": "Transformers", "completed": False},
                    {"name": "GANs", "completed": False},
                ]
            },
            {
                "phase": 4, "title": "Specialization & Portfolio", "status": "locked",
                "duration": "10 weeks",
                "modules": [
                    {"name": "NLP Projects", "completed": False},
                    {"name": "Computer Vision Projects", "completed": False},
                    {"name": "Capstone Project", "completed": False},
                    {"name": "Portfolio & Job Prep", "completed": False},
                ]
            },
        ],
    },
    {
        "title": "Full Stack Developer",
        "career_goal": "Full Stack Developer",
        "description": "Build modern web applications from frontend to backend",
        "total_weeks": 24,
        "phases": [
            {
                "phase": 1, "title": "HTML/CSS/JS Fundamentals", "status": "completed",
                "duration": "4 weeks",
                "modules": [
                    {"name": "HTML5", "completed": True},
                    {"name": "CSS3 & Flexbox", "completed": True},
                    {"name": "JavaScript ES6+", "completed": True},
                    {"name": "Git & GitHub", "completed": True},
                ]
            },
            {
                "phase": 2, "title": "React & Frontend", "status": "in-progress",
                "duration": "6 weeks",
                "modules": [
                    {"name": "React Fundamentals", "completed": True},
                    {"name": "State Management", "completed": False},
                    {"name": "React Router", "completed": False},
                    {"name": "Testing", "completed": False},
                ]
            },
            {
                "phase": 3, "title": "Backend Development", "status": "locked",
                "duration": "6 weeks",
                "modules": [
                    {"name": "Node.js & Express", "completed": False},
                    {"name": "REST APIs", "completed": False},
                    {"name": "Databases & ORM", "completed": False},
                    {"name": "Authentication & Auth", "completed": False},
                ]
            },
            {
                "phase": 4, "title": "DevOps & Deployment", "status": "locked",
                "duration": "8 weeks",
                "modules": [
                    {"name": "Docker", "completed": False},
                    {"name": "CI/CD Pipelines", "completed": False},
                    {"name": "Cloud Deployment", "completed": False},
                    {"name": "Capstone Project", "completed": False},
                ]
            },
        ],
    },
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Skills
        if db.query(Skill).count() == 0:
            skill_map = {}
            for s in SKILLS:
                skill = Skill(**s)
                db.add(skill)
                db.flush()
                skill_map[s["name"]] = skill.id
            logger.info(f"Seeded {len(SKILLS)} skills")
        else:
            skill_map = {s.name: s.id for s in db.query(Skill).all()}
            logger.info("Skills already seeded")

        # Questions
        if db.query(AssessmentQuestion).count() == 0:
            total_q = 0
            for skill_name, questions in QUESTIONS.items():
                skill_id = skill_map.get(skill_name)
                if skill_id:
                    for q in questions:
                        db.add(AssessmentQuestion(skill_id=skill_id, **q))
                        total_q += 1
            logger.info(f"Seeded {total_q} questions")
        else:
            logger.info("Questions already seeded")

        # Courses
        if db.query(Course).count() == 0:
            for c in COURSES:
                db.add(Course(**c))
            logger.info(f"Seeded {len(COURSES)} courses")
        else:
            logger.info("Courses already seeded")

        # Learning Paths
        if db.query(LearningPath).count() == 0:
            for lp in LEARNING_PATHS:
                db.add(LearningPath(**lp))
            logger.info(f"Seeded {len(LEARNING_PATHS)} learning paths")
        else:
            logger.info("Learning paths already seeded")

        # Demo user
        if db.query(User).count() == 0:
            demo = User(
                name="Rohani",
                email="demo@skillnova.ai",
                hashed_password=get_password_hash("demo123"),
                career_goal="AI Engineer",
                location="Mumbai, India",
                streak_days=6,
                total_xp=1850,
            )
            db.add(demo)
            logger.info("Created demo user: demo@skillnova.ai / demo123")

        db.commit()
        logger.info("✓ Database seeded successfully!")

    except Exception as e:
        db.rollback()
        logger.error(f"Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
