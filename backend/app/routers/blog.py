from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import logging
import requests

from app.models.schemas import (
    BlogGenerationRequest, 
    BlogGenerationResponse, 
    HistoryResponse,
    HistoryItem,
    ErrorResponse
)
from app.services.llm_service import llm_service
from app.services.database import get_db, db_service

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/generate", response_model=BlogGenerationResponse)
async def generate_blog(
    request: BlogGenerationRequest,
    db: Session = Depends(get_db)
):
    """Generate blog content using DeepSeek R1 via LM Studio"""
    try:
        logger.info(f"Generating blog for topic: {request.topic}")
        
        # Generate blog using LLM service
        result = llm_service.generate_blog(
            topic=request.topic,
            blog_type=request.blog_type,
            writing_style=request.writing_style,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
        # Save to database
        generation = db_service.save_generation(
            db=db,
            topic=request.topic,
            content=result["content"],
            blog_type=request.blog_type.value,
            writing_style=request.writing_style.value,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            generation_time=result.get("generation_time"),
            model_used=result.get("model_used")
        )
        
        # Return response
        return BlogGenerationResponse(
            id=generation.id,
            content=generation.content,
            topic=generation.topic,
            blog_type=generation.blog_type,
            writing_style=generation.writing_style,
            temperature=generation.temperature,
            max_tokens=generation.max_tokens,
            created_at=generation.created_at,
            word_count=generation.word_count,
            character_count=generation.character_count
        )
        
    except Exception as e:
        logger.error(f"Error generating blog: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=HistoryResponse)
async def get_history(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get generation history with optional search"""
    try:
        if search:
            generations = db_service.search_generations(db, search, limit)
            total = len(generations)  # For search, we'll return the count of results
        else:
            generations = db_service.get_history(db, limit, offset)
            total = db_service.get_total_count(db)
        
        items = [
            HistoryItem(
                id=gen.id,
                topic=gen.topic,
                content=gen.content[:200] + "..." if len(gen.content) > 200 else gen.content,
                blog_type=gen.blog_type,
                writing_style=gen.writing_style,
                created_at=gen.created_at,
                word_count=gen.word_count
            )
            for gen in generations
        ]
        
        return HistoryResponse(items=items, total=total)
        
    except Exception as e:
        logger.error(f"Error getting history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{generation_id}", response_model=BlogGenerationResponse)
async def get_generation(
    generation_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific generation by ID"""
    try:
        generation = db_service.get_generation_by_id(db, generation_id)
        
        if not generation:
            raise HTTPException(status_code=404, detail="Generation not found")
        
        return BlogGenerationResponse(
            id=generation.id,
            content=generation.content,
            topic=generation.topic,
            blog_type=generation.blog_type,
            writing_style=generation.writing_style,
            temperature=generation.temperature,
            max_tokens=generation.max_tokens,
            created_at=generation.created_at,
            word_count=generation.word_count,
            character_count=generation.character_count
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/history/{generation_id}")
async def delete_generation(
    generation_id: str,
    db: Session = Depends(get_db)
):
    """Delete a generation by ID"""
    try:
        success = db_service.delete_generation(db, generation_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Generation not found")
        
        return {"message": "Generation deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting generation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/models")
async def get_models():
    """Get available models from LM Studio"""
    try:
        models = llm_service.get_available_models()
        return {"models": models}
    except Exception as e:
        logger.error(f"Error getting models: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_status():
    """Get LM Studio connection status"""
    try:
        is_connected = llm_service.test_connection()
        return {
            "lm_studio_connected": is_connected,
            "status": "healthy" if is_connected else "lm_studio_disconnected",
            "message": "LM Studio is connected" if is_connected else "Cannot connect to LM Studio"
        }
    except Exception as e:
        logger.error(f"Error checking status: {e}")
        return {
            "lm_studio_connected": False,
            "status": "error",
            "message": str(e)
        }

@router.post("/test-generate")
async def test_generate():
    """Test endpoint for quick LLM response"""
    try:
        # Simple test with very short response
        payload = {
            "model": "deepseek-r1-distill-qwen-7b",
            "messages": [
                {"role": "user", "content": "Say 'Hello World' in exactly 2 words."}
            ],
            "max_tokens": 10,
            "temperature": 0.1
        }
        
        headers = {"Content-Type": "application/json"}
        
        response = requests.post(
            "http://localhost:1234/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            return {"success": True, "content": content}
        else:
            return {"success": False, "error": f"HTTP {response.status_code}"}
            
    except Exception as e:
        return {"success": False, "error": str(e)} 