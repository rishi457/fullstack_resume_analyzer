from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    is_premium: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class AnalysisBase(BaseModel):
    filename: str
    ats_score: float
    suggestions: str
    job_description_url: Optional[str] = None
    job_description_text: Optional[str] = None

class AnalysisResponse(AnalysisBase):
    id: int
    
    class Config:
        from_attributes = True
