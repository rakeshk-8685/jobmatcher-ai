"""
ATS Scoring Service
Calculates ATS score based on keyword matching
"""

from typing import List, Dict
import re

def calculate_ats_score(
    resume_text: str,
    job_description: str,
    required_skills: List[str] = None,
    experience_years: int = 0,
    required_experience: int = 0,
    education_level: str = None,
    required_education: str = None
) -> Dict:
    """
    Calculate ATS score using weighted components:
    - Keyword Match: 35%
    - Skill Match: 40%  
    - Experience Match: 15%
    - Education Match: 10%
    """
    
    resume_lower = resume_text.lower()
    jd_lower = job_description.lower()
    
    # 1. Keyword Match (35%)
    jd_words = set(re.findall(r'\b\w{4,}\b', jd_lower))
    resume_words = set(re.findall(r'\b\w{4,}\b', resume_lower))
    keyword_overlap = len(jd_words.intersection(resume_words))
    keyword_total = len(jd_words) if jd_words else 1
    keyword_score = min(100, (keyword_overlap / keyword_total) * 100 * 1.5)  # Boost factor
    
    # 2. Skill Match (40%)
    skill_score = 0
    matched_skills = []
    missing_skills = []
    
    if required_skills:
        for skill in required_skills:
            if skill.lower() in resume_lower:
                matched_skills.append(skill)
            else:
                missing_skills.append(skill)
        
        skill_score = (len(matched_skills) / len(required_skills)) * 100 if required_skills else 0
    else:
        skill_score = 70  # Default if no skills specified
    
    # 3. Experience Match (15%)
    if required_experience > 0:
        experience_ratio = min(1, experience_years / required_experience)
        experience_score = experience_ratio * 100
    else:
        experience_score = 80  # Default
    
    # 4. Education Match (10%)
    education_levels = ['high school', 'associate', 'bachelor', 'master', 'phd', 'doctorate']
    education_score = 70  # Default
    
    if required_education and education_level:
        req_idx = next((i for i, e in enumerate(education_levels) if required_education.lower() in e), 0)
        has_idx = next((i for i, e in enumerate(education_levels) if education_level.lower() in e), 0)
        
        if has_idx >= req_idx:
            education_score = 100
        else:
            education_score = max(0, 100 - (req_idx - has_idx) * 25)
    
    # Calculate weighted total
    overall = (
        keyword_score * 0.35 +
        skill_score * 0.40 +
        experience_score * 0.15 +
        education_score * 0.10
    )
    
    # Generate suggestions
    suggestions = []
    
    if keyword_score < 60:
        suggestions.append({
            "category": "keywords",
            "message": "Add more relevant keywords from the job description",
            "priority": "high"
        })
    
    if missing_skills:
        suggestions.append({
            "category": "skills",
            "message": f"Consider adding these skills: {', '.join(missing_skills[:5])}",
            "priority": "high" if len(missing_skills) > 3 else "medium"
        })
    
    if experience_score < 70:
        suggestions.append({
            "category": "experience",
            "message": "Highlight more relevant work experience",
            "priority": "medium"
        })
    
    return {
        "overall": round(overall, 1),
        "breakdown": {
            "keywords": round(keyword_score, 1),
            "skills": round(skill_score, 1),
            "experience": round(experience_score, 1),
            "education": round(education_score, 1)
        },
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions
    }
