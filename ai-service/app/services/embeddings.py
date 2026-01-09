"""
Text Embedding Service
Generates embeddings using sentence-transformers
"""

from typing import List
import numpy as np

# Lazy load to speed up startup
_model = None

def get_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            print(f"Warning: Could not load embedding model: {e}")
            _model = "fallback"
    return _model

def generate_embedding(text: str) -> List[float]:
    """Generate embedding vector for text"""
    model = get_model()
    
    if model == "fallback":
        # Fallback: use simple bag of words hash
        words = text.lower().split()
        embedding = [0.0] * 384
        for i, word in enumerate(words[:384]):
            embedding[i % 384] += hash(word) % 100 / 100
        return embedding
    
    embedding = model.encode(text, convert_to_numpy=True)
    return embedding.tolist()

def generate_embeddings_batch(texts: List[str]) -> List[List[float]]:
    """Generate embeddings for multiple texts"""
    model = get_model()
    
    if model == "fallback":
        return [generate_embedding(text) for text in texts]
    
    embeddings = model.encode(texts, convert_to_numpy=True)
    return embeddings.tolist()
