from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, Float, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_premium = Column(Boolean, default=False)

    analyses = relationship("Analysis", back_populates="owner")

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String)
    extracted_text = Column(Text)
    ats_score = Column(Float)
    suggestions = Column(Text)
    job_description_url = Column(String, nullable=True)
    job_description_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="analyses")
