from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OptimizationRequest(BaseModel):
    prompt: str
    goal: Optional[str] = "Improve clarity, structure, and effectiveness."
    model: Optional[str] = "gemini-flash" # Options: gemini-flash, llama3-70b
    api_key: Optional[str] = None # Allow passing key for flexibility

class GenerationRequest(BaseModel):
    prompt: str
    model: str

class Variation(BaseModel):
    variation: str
    critique: str
    score: int

class OptimizationResponse(BaseModel):
    original_prompt: str
    optimized_prompt: str
    improvements: str
    variations: List[Variation]
    created_at: datetime = datetime.now()
