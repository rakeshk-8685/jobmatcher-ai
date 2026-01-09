"""
Resume Routes
API endpoints for resume parsing
"""

from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from typing import Optional
import re

router = APIRouter()

def extract_skills(text: str) -> list:
    """Extract skills from resume text"""
    common_skills = [
        'python', 'javascript', 'typescript', 'react', 'angular', 'vue',
        'node.js', 'express', 'django', 'flask', 'java', 'c++', 'c#',
        'sql', 'mongodb', 'postgresql', 'mysql', 'redis', 'docker',
        'kubernetes', 'aws', 'azure', 'gcp', 'git', 'linux', 'rest api',
        'graphql', 'html', 'css', 'sass', 'tailwind', 'redux', 'next.js',
        'machine learning', 'data analysis', 'agile', 'scrum'
    ]
    
    text_lower = text.lower()
    found_skills = [skill for skill in common_skills if skill in text_lower]
    return list(set(found_skills))

def extract_experience_years(text: str) -> int:
    """Extract years of experience from resume"""
    patterns = [
        r'(\d+)\+?\s*years?\s*(?:of\s*)?experience',
        r'(\d+)\+?\s*years?\s*(?:in|of)',
        r'experience[:\s]*(\d+)\+?\s*years?'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.lower())
        if match:
            return int(match.group(1))
    
    return 0

def extract_education(text: str) -> dict:
    """Extract education information"""
    education = {
        "degrees": [],
        "highest_level": None
    }
    
    degree_patterns = {
        'phd': ['ph.d', 'phd', 'doctorate'],
        'master': ['master', 'mba', 'm.s.', 'ms', 'm.a.'],
        'bachelor': ['bachelor', 'b.s.', 'bs', 'b.a.', 'ba'],
        'associate': ['associate', 'a.a.', 'a.s.']
    }
    
    text_lower = text.lower()
    
    for level, patterns in degree_patterns.items():
        for pattern in patterns:
            if pattern in text_lower:
                education["degrees"].append(level)
                if not education["highest_level"]:
                    education["highest_level"] = level
                break
    
    return education

@router.post("/parse-resume")
async def parse_resume(text: str):
    """Parse resume text and extract information"""
    
    skills = extract_skills(text)
    experience_years = extract_experience_years(text)
    education = extract_education(text)
    
    # Extract email
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    email = email_match.group(0) if email_match else None
    
    # Extract phone
    phone_match = re.search(r'[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}', text)
    phone = phone_match.group(0) if phone_match else None
    
    return {
        "success": True,
        "data": {
            "skills": skills,
            "experience_years": experience_years,
            "education": education,
            "contact": {
                "email": email,
                "phone": phone
            }
        }
    }
