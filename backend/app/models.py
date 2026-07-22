from sqlalchemy import Column, Integer, String
from .database import Base


class Upload(Base):
    __tablename__ = "uploads"

    id = Column(Integer, primary_key=True, index=True)

    section = Column(String, nullable=False)

    filename = Column(String, nullable=False)

    filepath = Column(String, nullable=False)