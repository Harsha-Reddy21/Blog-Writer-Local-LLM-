from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import blog
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Blog Writer API",
    description="AI Blog Writer powered by DeepSeek R1 via LM Studio",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(blog.router, prefix="/api", tags=["blog"])

@app.get("/")
async def root():
    return {"message": "Blog Writer API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is operational"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 