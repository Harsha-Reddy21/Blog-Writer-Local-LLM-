from sqlalchemy import create_engine, Column, String, DateTime, Float, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
import uuid
import os

# Database setup
DATABASE_URL = "sqlite:///./blog_writer.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class BlogGeneration(Base):
    __tablename__ = "blog_generations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    topic = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    blog_type = Column(String, nullable=False)
    writing_style = Column(String, nullable=False)
    temperature = Column(Float, nullable=False)
    max_tokens = Column(Integer, nullable=False)
    word_count = Column(Integer, nullable=False)
    character_count = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    generation_time = Column(Float, nullable=True)
    model_used = Column(String, nullable=True)

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class DatabaseService:
    def __init__(self):
        pass
    
    def save_generation(
        self, 
        db: Session,
        topic: str,
        content: str,
        blog_type: str,
        writing_style: str,
        temperature: float,
        max_tokens: int,
        generation_time: float = None,
        model_used: str = None
    ) -> BlogGeneration:
        """Save a blog generation to database"""
        
        word_count = len(content.split())
        character_count = len(content)
        
        generation = BlogGeneration(
            topic=topic,
            content=content,
            blog_type=blog_type,
            writing_style=writing_style,
            temperature=temperature,
            max_tokens=max_tokens,
            word_count=word_count,
            character_count=character_count,
            generation_time=generation_time,
            model_used=model_used
        )
        
        db.add(generation)
        db.commit()
        db.refresh(generation)
        
        return generation
    
    def get_history(self, db: Session, limit: int = 50, offset: int = 0) -> list:
        """Get generation history"""
        return db.query(BlogGeneration)\
                 .order_by(BlogGeneration.created_at.desc())\
                 .offset(offset)\
                 .limit(limit)\
                 .all()
    
    def get_generation_by_id(self, db: Session, generation_id: str) -> BlogGeneration:
        """Get a specific generation by ID"""
        return db.query(BlogGeneration)\
                 .filter(BlogGeneration.id == generation_id)\
                 .first()
    
    def delete_generation(self, db: Session, generation_id: str) -> bool:
        """Delete a generation by ID"""
        generation = self.get_generation_by_id(db, generation_id)
        if generation:
            db.delete(generation)
            db.commit()
            return True
        return False
    
    def get_total_count(self, db: Session) -> int:
        """Get total number of generations"""
        return db.query(BlogGeneration).count()
    
    def search_generations(self, db: Session, query: str, limit: int = 50) -> list:
        """Search generations by topic or content"""
        return db.query(BlogGeneration)\
                 .filter(
                     BlogGeneration.topic.contains(query) | 
                     BlogGeneration.content.contains(query)
                 )\
                 .order_by(BlogGeneration.created_at.desc())\
                 .limit(limit)\
                 .all()

# Global instance
db_service = DatabaseService() 