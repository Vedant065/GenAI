import os
import json
import logging
from fastapi import FastAPI, HTTPException, Path, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from models import (
    EmailRequest, ReportRequest, ExplainRequest, ImproveRequest, PromptRequest,
    GenericGenerateRequest, GenerationResponse, HealthResponse
)
import database
import prompts
import gemini_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="GenAI Content Studio API",
    description="Backend service powering GenAI Content Studio with Google Gemini API & Prompt Engineering",
    version="1.0.0"
)

# CORS configuration for production & local React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    database.init_db()
    logger.info("Database initialized successfully.")

@app.get("/", tags=["Health"])
def read_root():
    return {
        "app": "GenAI Content Studio API",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
def health_check():
    status_info = gemini_service.check_gemini_status()
    return HealthResponse(
        status="online",
        api_key_configured=status_info["configured"],
        model=status_info["model"],
        database="SQLite (genai_studio.db)"
    )

@app.post("/api/email", response_model=GenerationResponse, tags=["Generators"])
async def generate_email(request: EmailRequest):
    prompt_text = prompts.build_email_prompt(
        purpose=request.purpose,
        recipient=request.recipient,
        key_points=request.key_points,
        tone=request.tone,
        length=request.length
    )
    
    success, result_or_err = await gemini_service.generate_text(prompt_text)
    
    if not success:
        return GenerationResponse(
            success=False,
            mode="email",
            title=f"Email: {request.purpose[:30]}...",
            content="",
            error=result_or_err
        )
        
    title = f"Email to {request.recipient}: {request.purpose[:30]}"
    saved = database.save_generation(
        mode="email",
        title=title,
        input_data=request.dict(),
        output_content=result_or_err
    )
    
    return GenerationResponse(
        success=True,
        id=saved["id"],
        mode="email",
        title=title,
        content=result_or_err,
        created_at=saved["created_at"]
    )

@app.post("/api/report", response_model=GenerationResponse, tags=["Generators"])
async def generate_report(request: ReportRequest):
    prompt_text = prompts.build_report_prompt(
        topic=request.topic,
        purpose=request.purpose,
        length=request.length,
        academic_level=request.academic_level,
        sections=request.sections
    )
    
    success, result_or_err = await gemini_service.generate_text(prompt_text)
    
    if not success:
        return GenerationResponse(
            success=False,
            mode="report",
            title=f"Report: {request.topic[:30]}",
            content="",
            error=result_or_err
        )
        
    title = f"Report: {request.topic}"
    saved = database.save_generation(
        mode="report",
        title=title,
        input_data=request.dict(),
        output_content=result_or_err
    )
    
    return GenerationResponse(
        success=True,
        id=saved["id"],
        mode="report",
        title=title,
        content=result_or_err,
        created_at=saved["created_at"]
    )

@app.post("/api/explain", response_model=GenerationResponse, tags=["Generators"])
async def generate_explanation(request: ExplainRequest):
    prompt_text = prompts.build_explain_prompt(
        topic=request.topic,
        difficulty=request.difficulty
    )
    
    success, result_or_err = await gemini_service.generate_text(prompt_text)
    
    if not success:
        return GenerationResponse(
            success=False,
            mode="explain",
            title=f"Explainer: {request.topic}",
            content="",
            error=result_or_err
        )
        
    title = f"Explainer ({request.difficulty}): {request.topic}"
    saved = database.save_generation(
        mode="explain",
        title=title,
        input_data=request.dict(),
        output_content=result_or_err
    )
    
    return GenerationResponse(
        success=True,
        id=saved["id"],
        mode="explain",
        title=title,
        content=result_or_err,
        created_at=saved["created_at"]
    )

@app.post("/api/improve", response_model=GenerationResponse, tags=["Generators"])
async def generate_improvement(request: ImproveRequest):
    prompt_text = prompts.build_improve_prompt(text=request.text)
    
    success, result_or_err = await gemini_service.generate_text(prompt_text)
    
    if not success:
        return GenerationResponse(
            success=False,
            mode="improve",
            title=f"Text Improvement",
            content="",
            error=result_or_err
        )
        
    short_title = request.text.strip().replace("\n", " ")[:35] + "..."
    title = f"Improved: {short_title}"
    saved = database.save_generation(
        mode="improve",
        title=title,
        input_data=request.dict(),
        output_content=result_or_err
    )
    
    return GenerationResponse(
        success=True,
        id=saved["id"],
        mode="improve",
        title=title,
        content=result_or_err,
        created_at=saved["created_at"]
    )

@app.post("/api/prompt", response_model=GenerationResponse, tags=["Generators"])
async def generate_prompt(request: PromptRequest):
    prompt_text = prompts.build_prompt_generator_prompt(description=request.description)
    
    success, result_or_err = await gemini_service.generate_text(prompt_text)
    
    if not success:
        return GenerationResponse(
            success=False,
            mode="prompt",
            title=f"Prompt Optimization",
            content="",
            error=result_or_err
        )
        
    short_desc = request.description.strip().replace("\n", " ")[:35] + "..."
    title = f"Prompt Template: {short_desc}"
    saved = database.save_generation(
        mode="prompt",
        title=title,
        input_data=request.dict(),
        output_content=result_or_err
    )
    
    return GenerationResponse(
        success=True,
        id=saved["id"],
        mode="prompt",
        title=title,
        content=result_or_err,
        created_at=saved["created_at"]
    )

@app.post("/api/generate", response_model=GenerationResponse, tags=["Generators"])
async def generic_generate(req: GenericGenerateRequest):
    mode = req.mode.lower()
    data = req.data
    
    if mode == "email":
        return await generate_email(EmailRequest(**data))
    elif mode == "report":
        return await generate_report(ReportRequest(**data))
    elif mode == "explain":
        return await generate_explanation(ExplainRequest(**data))
    elif mode == "improve":
        return await generate_improvement(ImproveRequest(**data))
    elif mode == "prompt":
        return await generate_prompt(PromptRequest(**data))
    else:
        raise HTTPException(status_code=400, detail=f"Unknown AI mode: '{mode}'. Valid modes: email, report, explain, improve, prompt.")

@app.get("/api/history", tags=["History"])
def get_history(limit: int = Query(50, ge=1, le=200)):
    return database.get_all_generations(limit=limit)

@app.delete("/api/history/{item_id}", tags=["History"])
def delete_history_item(item_id: int = Path(..., ge=1)):
    deleted = database.delete_generation(item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"History item with ID {item_id} not found.")
    return {"success": True, "message": f"History item {item_id} deleted successfully."}

@app.delete("/api/history", tags=["History"])
def clear_history():
    database.clear_all_generations()
    return {"success": True, "message": "All history cleared successfully."}

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host=host, port=port, reload=True)
