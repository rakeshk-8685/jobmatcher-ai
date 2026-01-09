"""
Similarity Calculation Service
Computes cosine similarity between embeddings
"""

from typing import List
import numpy as np

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two vectors"""
    a = np.array(vec1)
    b = np.array(vec2)
    
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    
    if norm_a == 0 or norm_b == 0:
        return 0.0
    
    similarity = dot_product / (norm_a * norm_b)
    return float(similarity)

def calculate_match_score(ats_score: float, ai_similarity: float) -> float:
    """
    Calculate final match score:
    Final Score = (ATS Score * 0.6) + (AI Similarity * 0.4)
    
    ATS score is 0-100, AI similarity is 0-1
    Convert AI similarity to 0-100 scale
    """
    ai_score = ai_similarity * 100
    final_score = (ats_score * 0.6) + (ai_score * 0.4)
    return round(final_score, 1)
