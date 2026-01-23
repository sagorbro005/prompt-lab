from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.schemas import OptimizationRequest, OptimizationResponse, GenerationRequest
from services.ai_service import GeneticPromptOptimizer
from services.db_service import DBService, OptimizationRecord
import os
from typing import List

app = FastAPI(title="PromptLab API")
db_service = DBService()

# CORS Setup
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    os.getenv("FRONTEND_URL", "*"), # Allow production frontend

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to PromptLab API"}

@app.post("/optimize", response_model=OptimizationResponse)
def optimize_prompt(request: OptimizationRequest):
    try:
        optimizer = GeneticPromptOptimizer(api_key=request.api_key)
        response = optimizer.optimize(request)
        
        # Save to DB
        record = OptimizationRecord(
            original_prompt=response.original_prompt,
            optimized_prompt=response.optimized_prompt,
            improvement_score=response.variations[0].score, # Use top score
            improvements=response.improvements
        )
        db_service.save_optimization(record)
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate")
def generate_completion(request: GenerationRequest):
    try:
        optimizer = GeneticPromptOptimizer()
        result = optimizer.generate_completion(request.prompt, request.model)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history", response_model=List[OptimizationRecord])
def get_history():
    return db_service.get_history()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
