# backend/app/seed.py
import os
from sqlalchemy.orm import Session
from .models import User, Course, Module, Lesson
from .auth import hash_password

PLACEHOLDER_YT = "https://www.youtube.com/embed/dQw4w9WgXcQ"

SEED_COURSES = [
    {
        "name": "Python for AI",
        "description": "Master Python fundamentals tailored for AI and machine learning workflows.",
        "modules": [
            {
                "name": "Python Basics",
                "lessons": [{"title": "Variables, Data Types & Control Flow", "youtube_url": PLACEHOLDER_YT}],
            },
            {
                "name": "Advanced Python",
                "lessons": [{"title": "OOP, Decorators & Generators", "youtube_url": PLACEHOLDER_YT}],
            },
        ],
    },
    {
        "name": "Machine Learning",
        "description": "Learn supervised and unsupervised learning algorithms from scratch.",
        "modules": [
            {
                "name": "Supervised Learning",
                "lessons": [{"title": "Linear Regression & Classification", "youtube_url": PLACEHOLDER_YT}],
            },
            {
                "name": "Unsupervised Learning",
                "lessons": [{"title": "Clustering & Dimensionality Reduction", "youtube_url": PLACEHOLDER_YT}],
            },
        ],
    },
    {
        "name": "Deep Learning",
        "description": "Dive into neural networks, CNNs, RNNs, and transformer architectures.",
        "modules": [
            {
                "name": "Neural Networks",
                "lessons": [{"title": "Perceptrons, Activation Functions & Backprop", "youtube_url": PLACEHOLDER_YT}],
            },
        ],
    },
    {
        "name": "Data Science",
        "description": "End-to-end data analysis: wrangling, visualisation, and insight extraction.",
        "modules": [
            {
                "name": "Data Analysis",
                "lessons": [{"title": "Pandas, NumPy & Matplotlib Fundamentals", "youtube_url": PLACEHOLDER_YT}],
            },
        ],
    },
]


def run_seed(db: Session) -> None:
    # Only seed if no users exist
    if db.query(User).count() > 0:
        return

    # Admin account
    admin = User(
        email=os.getenv("ADMIN_EMAIL", "admin@eduflow.com"),
        password_hash=hash_password(os.getenv("ADMIN_PASSWORD", "Admin@1234")),
        full_name=os.getenv("ADMIN_NAME", "EduFlow Admin"),
        role="admin",
    )
    db.add(admin)

    # Sample courses
    for c_idx, course_data in enumerate(SEED_COURSES):
        course = Course(
            name=course_data["name"],
            description=course_data["description"],
            order_index=c_idx,
        )
        db.add(course)
        db.flush()  # get course.id

        for m_idx, module_data in enumerate(course_data["modules"]):
            module = Module(
                course_id=course.id,
                name=module_data["name"],
                order_index=m_idx,
            )
            db.add(module)
            db.flush()

            for l_idx, lesson_data in enumerate(module_data["lessons"]):
                lesson = Lesson(
                    module_id=module.id,
                    title=lesson_data["title"],
                    youtube_url=lesson_data["youtube_url"],
                    order_index=l_idx,
                )
                db.add(lesson)

    db.commit()
    print("✓ Seed data inserted")
