from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
import os
import shutil
import sys
from pathlib import Path

# Add the current directory to sys.path to resolve module imports
sys.path.append(str(Path(__file__).parent))

import models, schemas, auth, database
from database import get_db, engine
from services import ai_service, pdf_service, jd_service
from auth import get_current_user
from fastapi.responses import FileResponse

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Resume Analyzer API")

# CORS setup
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Auth Routes -----------------

@app.post("/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_pwd = auth.get_password_hash(user.password)
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login", response_model=schemas.Token)
def login(form_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# ----------------- Resume Analysis -----------------

@app.post("/analyze", response_model=schemas.AnalysisResponse)
async def upload_and_analyze(
    file: UploadFile = File(...),
    jd_url: str = None,
    jd_text: str = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Create an upload directory
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
        
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Extract & Analyze
    resume_text = ai_service.extract_text_from_pdf(file_path)
    
    # JD Processing
    final_jd_text = jd_text
    if jd_url and not final_jd_text:
        final_jd_text = jd_service.extract_jd_text(jd_url)
        
    result = ai_service.analyze_resume(resume_text, final_jd_text)
    
    # Save to DB
    new_analysis = models.Analysis(
        user_id=current_user.id,
        filename=file.filename,
        extracted_text=resume_text,
        ats_score=result["ats_score"],
        suggestions=result["suggestions"],
        job_description_url=jd_url,
        job_description_text=final_jd_text
    )
    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)
    
    return new_analysis

@app.get("/history", response_model=List[schemas.AnalysisResponse])
def get_user_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Analysis).filter(models.Analysis.user_id == current_user.id).order_by(models.Analysis.created_at.desc()).all()

@app.get("/analyses/{analysis_id}", response_model=schemas.AnalysisResponse)
def get_analysis_details(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    analysis = db.query(models.Analysis).filter(models.Analysis.id == analysis_id, models.Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis

@app.get("/download/{analysis_id}")
def download_analysis_report(
    analysis_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    analysis = db.query(models.Analysis).filter(models.Analysis.id == analysis_id, models.Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    # Generate PDF
    download_dir = "downloads"
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)
        
    pdf_filename = f"analysis_report_{analysis_id}.pdf"
    pdf_path = os.path.join(download_dir, pdf_filename)
    
    # Using the PDF service logic
    pdf_service.generate_analysis_pdf({
        "filename": analysis.filename,
        "ats_score": analysis.ats_score,
        "suggestions": analysis.suggestions
    }, pdf_path)
    
    return FileResponse(path=pdf_path, filename=pdf_filename, media_type='application/pdf')

# ----------------- Payments (Razorpay Mock) -----------------

@app.post("/premium/unlock")
def unlock_premium(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # In a real integration, you would verify Razorpay payment signatures here
    current_user.is_premium = True
    db.commit()
    return {"message": "Premium features unlocked!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
