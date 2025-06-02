from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class BlogType(str, Enum):
    INTRO = "intro"
    FULL_ARTICLE = "full_article"
    LISTICLE = "listicle"
    TUTORIAL = "tutorial"

class WritingStyle(str, Enum):
    PROFESSIONAL = "professional"
    CASUAL = "casual"
    TECHNICAL = "technical"
    CREATIVE = "creative"

class BlogGenerationRequest(BaseModel):
    topic: str = Field(..., min_length=1, max_length=500, description="The blog topic")
    blog_type: BlogType = Field(default=BlogType.INTRO, description="Type of blog content")
    writing_style: WritingStyle = Field(default=WritingStyle.PROFESSIONAL, description="Writing style")
    temperature: float = Field(default=0.7, ge=0.0, le=1.0, description="Model temperature")
    max_tokens: int = Field(default=512, ge=50, le=2000, description="Maximum tokens to generate")

class BlogGenerationResponse(BaseModel):
    id: str
    content: str
    topic: str
    blog_type: str
    writing_style: str
    temperature: float
    max_tokens: int
    created_at: datetime
    word_count: int
    character_count: int

class HistoryItem(BaseModel):
    id: str
    topic: str
    content: str
    blog_type: str
    writing_style: str
    created_at: datetime
    word_count: int

class HistoryResponse(BaseModel):
    items: List[HistoryItem]
    total: int

class ErrorResponse(BaseModel):
    error: str
    message: str
    status_code: int

class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: datetime 