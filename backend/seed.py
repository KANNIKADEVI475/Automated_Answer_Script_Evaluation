from database import SessionLocal
from models import User

db = SessionLocal()

# Avoid duplicate users
existing = db.query(User).filter(User.username == "admin").first()

if existing is None:
    user1 = User(
        username="admin",
        password="1234"
    )

    user2 = User(
        username="student",
        password="abcd"
    )

    db.add(user1)
    db.add(user2)
    db.commit()

    print("Users inserted successfully.")
else:
    print("Users already exist.")

db.close()