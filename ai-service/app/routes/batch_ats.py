"""
Batch ATS Routes
High-performance bulk resume analysis endpoint
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
from concurrent.futures import ProcessPoolExecutor
from app.services.ats_scoring import calculate_ats_score, calculate_ats_scores_batch

router = APIRouter()

# Process pool for CPU-bound operations bypassing GIL
executor = ProcessPoolExecutor(max_workers=8)


class ResumeItem(BaseModel):
    resume_text: str
    file_name: Optional[str] = None
    experience_years: Optional[int] = 0
    education_level: Optional[str] = None


class BatchATSRequest(BaseModel):
    resumes: List[ResumeItem]
    job_description: str
    required_skills: Optional[List[str]] = None
    required_experience: Optional[int] = 0
    required_education: Optional[str] = None


class BatchATSResult(BaseModel):
    file_name: str
    overall: float
    breakdown: Dict[str, float]
    matched_skills: List[str]
    missing_skills: List[str]
    suggestions: List[Dict[str, Any]]
    status: str


@router.post("/batch-ats-score")
async def get_batch_ats_scores(request: BatchATSRequest):
    """
    Calculate ATS scores for multiple resumes in a single request.
    Optimized for bulk processing with parallel execution.
    
    Supports up to 100 resumes per request for optimal performance.
    """
    
    if len(request.resumes) > 100:
        return {
            "success": False,
            "error": "Maximum 100 resumes per batch. Split into multiple requests."
        }
    
    print(f"[AI Service] Incoming batch ATS score request for {len(request.resumes)} resumes")
    print(f"  - Job Description length: {len(request.job_description)} chars")
    resume_texts = [r.resume_text for r in request.resumes]
    experience_years_list = [r.experience_years or 0 for r in request.resumes]
    education_levels = [r.education_level for r in request.resumes]
    file_names = [r.file_name or f"resume_{i+1}" for i, r in enumerate(request.resumes)]
    
    # Use batch scoring for efficiency
    loop = asyncio.get_event_loop()
    
    # Run batch scoring in thread pool to not block event loop
    results = await loop.run_in_executor(
        executor,
        calculate_ats_scores_batch,
        resume_texts,
        request.job_description,
        request.required_skills or [],
        experience_years_list,
        request.required_experience or 0,
        education_levels,
        request.required_education
    )
    
    # Format results
    formatted_results = []
    for i, result in enumerate(results):
        score = result["overall"]
        status = "excellent" if score >= 80 else "good" if score >= 65 else "partial" if score >= 50 else "poor"
        
        formatted_results.append({
            "file_name": file_names[i],
            "overall": result["overall"],
            "breakdown": result["breakdown"],
            "matched_skills": result["matched_skills"],
            "missing_skills": result["missing_skills"],
            "suggestions": result["suggestions"],
            "status": status
        })
    
    return {
        "success": True,
        "data": {
            "results": formatted_results,
            "summary": {
                "total": len(formatted_results),
                "excellent": sum(1 for r in formatted_results if r["status"] == "excellent"),
                "good": sum(1 for r in formatted_results if r["status"] == "good"),
                "partial": sum(1 for r in formatted_results if r["status"] == "partial"),
                "poor": sum(1 for r in formatted_results if r["status"] == "poor"),
                "average_score": round(sum(r["overall"] for r in formatted_results) / len(formatted_results), 1) if formatted_results else 0
            }
        }
    }
