import fitz  # PyMuPDF

from openai import OpenAI
import os
import json
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend/
env_path = Path(__file__).parents[1] / ".env"
load_dotenv(dotenv_path=env_path)

# Verify API Key
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key or "your_groq_api_key_here" in groq_api_key:
    raise ValueError("❌ GROQ_API_KEY not found or is still the placeholder. Update your backend/.env file!")

# Initialize Groq client (using OpenAI compatible SDK)
client = OpenAI(
    api_key=groq_api_key,
    base_url="https://api.groq.com/openai/v1"
)

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    with fitz.open(file_path) as doc:
        for page in doc:
            text += page.get_text()
    return text

def analyze_resume(resume_text: str, jd_text: str = None):
    if jd_text:
        prompt = f"""
        Analyze the following resume text against the provided Job Description (JD).
        1. Provide a Match Score (ATS compatible) from 0 to 100.
        2. Identify key missing keywords from the JD.
        3. Suggest specific improvements to align the resume with this role.
        
        Return ONLY a JSON response in this format:
        {{
            "ats_score": number,
            "suggestions": "detailed gap analysis and improvements"
        }}

        Job Description:
        {jd_text}

        Resume Text:
        {resume_text}
        """
    else:
        prompt = f"""
        Analyze the following resume text for ATS (Applicant Tracking System) compatibility.
        Provide an ATS Score from 0 to 100 and a list of specific improvement suggestions.
        Return ONLY a JSON response in this format:
        {{
            "ats_score": number,
            "suggestions": "detailed text summary of improvements"
        }}

        Resume Text:
        {resume_text}
        """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", "content": "You are an expert HR and ATS specialist."},
                      {"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        
        result = json.loads(response.choices[0].message.content)
        return result
    except Exception as e:
        print(f"AI Analysis Error: {e}")
        return {"ats_score": 0, "suggestions": "Error analyzing resume. Please check API key."}
