"""
JobMatcher AI Service
FastAPI microservice for ATS scoring and AI matching
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import ats, similarity, resume, batch_ats

app = FastAPI(
    title="JobMatcher AI Service",
    description="AI-powered ATS scoring and resume matching",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "jobmatcher-ai"
    }

# Include routers
app.include_router(ats.router, prefix="/ai", tags=["ATS"])
app.include_router(batch_ats.router, prefix="/ai", tags=["Batch ATS"])
app.include_router(similarity.router, prefix="/ai", tags=["Similarity"])
app.include_router(resume.router, prefix="/ai", tags=["Resume"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
