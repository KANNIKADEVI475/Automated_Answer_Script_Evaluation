from database import SessionLocal
from models import User

db = SessionLocal()

users = [
    ("admin", "1234"),
    ("nivetha", "dec18"),
    ("praveena", "oct19"),
    ("kannika", "jun14"),
]

for username, password in users:
    existing = db.query(User).filter(User.username == username).first()

    if not existing:
        db.add(User(username=username, password=password))

db.commit()
db.close()

print("Database seeded successfully.")