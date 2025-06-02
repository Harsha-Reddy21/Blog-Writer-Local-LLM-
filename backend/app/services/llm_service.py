import requests
import json
import logging
from typing import Dict, Any
import time
from app.models.schemas import BlogType, WritingStyle

logger = logging.getLogger(__name__)

class LMStudioService:
    def __init__(self, base_url: str = "http://localhost:1234"):
        self.base_url = base_url
        self.chat_endpoint = f"{base_url}/v1/chat/completions"
        self.models_endpoint = f"{base_url}/v1/models"
        
    def test_connection(self) -> bool:
        """Test connection to LM Studio"""
        try:
            response = requests.get(self.models_endpoint, timeout=5)
            return response.status_code == 200
        except Exception as e:
            logger.error(f"Failed to connect to LM Studio: {e}")
            return False
    
    def get_available_models(self) -> list:
        """Get list of available models from LM Studio"""
        try:
            response = requests.get(self.models_endpoint, timeout=5)
            if response.status_code == 200:
                data = response.json()
                return [model["id"] for model in data.get("data", [])]
            return []
        except Exception as e:
            logger.error(f"Failed to get models: {e}")
            return []
    
    def _create_prompt(self, topic: str, blog_type: BlogType, writing_style: WritingStyle) -> str:
        """Create optimized prompt based on blog type and writing style"""
        
        style_instructions = {
            WritingStyle.PROFESSIONAL: "Write in a professional, authoritative tone with clear structure and formal language.",
            WritingStyle.CASUAL: "Write in a conversational, friendly tone that's easy to read and engaging.",
            WritingStyle.TECHNICAL: "Write with technical accuracy, using appropriate jargon and detailed explanations.",
            WritingStyle.CREATIVE: "Write with creativity, using storytelling elements and engaging metaphors."
        }
        
        type_instructions = {
            BlogType.INTRO: "Write a compelling blog introduction (2-3 paragraphs) that hooks the reader and introduces the topic.",
            BlogType.FULL_ARTICLE: "Write a complete blog article with introduction, main points, and conclusion.",
            BlogType.LISTICLE: "Write a listicle-style blog post with numbered or bulleted points.",
            BlogType.TUTORIAL: "Write a step-by-step tutorial or how-to guide."
        }
        
        prompt = f"""You are an expert blog writer. {type_instructions[blog_type]}

Topic: {topic}

Writing Style: {style_instructions[writing_style]}

Requirements:
- Make it engaging and well-structured
- Use appropriate headings if needed
- Keep the content focused and valuable
- Write in {writing_style.value} style

Please write the blog content now:"""
        
        return prompt
    
    def generate_blog(
        self, 
        topic: str, 
        blog_type: BlogType, 
        writing_style: WritingStyle,
        temperature: float = 0.7,
        max_tokens: int = 256,
        model_name: str = "deepseek-r1-distill-qwen-7b"
    ) -> Dict[str, Any]:
        """Generate blog content using LM Studio"""
        
        if not self.test_connection():
            raise Exception("Cannot connect to LM Studio. Please ensure it's running on localhost:1234")
        
        prompt = self._create_prompt(topic, blog_type, writing_style)
        
        payload = {
            "model": model_name,
            "messages": [
                {
                    "role": "system", 
                    "content": "You are a professional blog writer who creates engaging, well-structured content."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
            "top_p": 0.9,
            "frequency_penalty": 0.1,
            "stream": False
        }
        
        headers = {
            "Content-Type": "application/json"
        }
        
        try:
            logger.info(f"Generating blog for topic: {topic}")
            start_time = time.time()
            
            response = requests.post(
                self.chat_endpoint, 
                headers=headers, 
                data=json.dumps(payload),
                timeout=300  # 5 minute timeout for reasoning models
            )
            
            response.raise_for_status()
            
            generation_time = time.time() - start_time
            logger.info(f"Blog generated in {generation_time:.2f} seconds")
            
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            
            return {
                "content": content,
                "generation_time": generation_time,
                "model_used": model_name,
                "tokens_used": data.get("usage", {}).get("total_tokens", 0)
            }
            
        except requests.exceptions.Timeout:
            raise Exception("Request timed out. The model might be taking too long to respond.")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Request failed: {str(e)}")
        except KeyError as e:
            raise Exception(f"Unexpected response format: {str(e)}")
        except Exception as e:
            logger.error(f"Error generating blog: {e}")
            raise Exception(f"Failed to generate blog: {str(e)}")

# Global instance
llm_service = LMStudioService() 