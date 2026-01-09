"""
ATS Routes
API endpoints for ATS scoring
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.services.ats_scoring import calculate_ats_score

router = APIRouter()

class ATSRequest(BaseModel):
    resume_text: str
    job_description: str
    required_skills: Optional[List[str]] = None
    experience_years: Optional[int] = 0
    required_experience: Optional[int] = 0
    education_level: Optional[str] = None
    required_education: Optional[str] = None

@router.post("/ats-score")
async def get_ats_score(request: ATSRequest):
    """Calculate ATS score for resume against job description"""
    result = calculate_ats_score(
        resume_text=request.resume_text,
        job_description=request.job_description,
        required_skills=request.required_skills,
        experience_years=request.experience_years,
        required_experience=request.required_experience,
        education_level=request.education_level,
        required_education=request.required_education
    )
    return {"success": True, "data": result}
