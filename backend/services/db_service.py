import os
from supabase import create_client, Client
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OptimizationRecord(BaseModel):
    id: Optional[str] = None
    original_prompt: str
    optimized_prompt: str
    improvement_score: int
    improvements: str
    created_at: Optional[datetime] = None

class DBService:
    def __init__(self):
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")
        
        if url and key:
            self.supabase: Client = create_client(url, key)
            self.enabled = True
        else:
            print("Warning: SUPABASE_URL or SUPABASE_KEY not found. Database features disabled.")
            self.enabled = False

    def save_optimization(self, record: OptimizationRecord):
        if not self.enabled:
            return None
        
        try:
            data = record.dict(exclude={'id', 'created_at'}, exclude_none=True)
            response = self.supabase.table('optimizations').insert(data).execute()
            return response
        except Exception as e:
            print(f"DB Error save_optimization: {e}")
            return None

    def get_history(self) -> List[OptimizationRecord]:
        if not self.enabled:
            return []
            
        try:
            response = self.supabase.table('optimizations').select("*").order('created_at', desc=True).execute()
            # Convert response data to OptimizationRecord objects
            return [OptimizationRecord(**item) for item in response.data]
        except Exception as e:
            print(f"DB Error get_history: {e}")
            return []
