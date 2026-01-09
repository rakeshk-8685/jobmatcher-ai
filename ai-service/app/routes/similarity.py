"""
Similarity Routes
API endpoints for AI similarity matching
"""

from fastapi import APIRouter
from pydantic import BaseModel
from app.services.embeddings import generate_embedding
from app.services.similarity import cosine_similarity, calculate_match_score

router = APIRouter()

class SimilarityRequest(BaseModel):
    text1: str
    text2: str
    ats_score: float = 0

@router.post("/similarity")
async def get_similarity(request: SimilarityRequest):
    """Calculate semantic similarity between two texts"""
    emb1 = generate_embedding(request.text1)
    emb2 = generate_embedding(request.text2)
    
    similarity = cosine_similarity(emb1, emb2)
    
    result = {
        "similarity": round(similarity, 4),
        "similarity_percentage": round(similarity * 100, 1)
    }
    
    if request.ats_score > 0:
        result["final_score"] = calculate_match_score(request.ats_score, similarity)
    
    return {"success": True, "data": result}

@router.post("/embedding")
async def get_embedding(text: str):
    """Generate embedding for text"""
    embedding = generate_embedding(text)
    return {"success": True, "data": {"embedding": embedding}}
