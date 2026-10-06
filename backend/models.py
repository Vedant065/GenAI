from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class EmailRequest(BaseModel):
    purpose: str = Field(..., description="Main purpose of the email")
    recipient: str = Field(..., description="Recipient designation or name")
    key_points: str = Field("", description="Key details or bullet points to include")
    tone: str = Field("Professional", description="Tone of the email (Professional, Formal, Friendly, Persuasive, Apologetic)")
    length: str = Field("Medium", description="Length of the email (Short, Medium, Detailed)")

class ReportRequest(BaseModel):
    topic: str = Field(..., description="Topic of the report")
    purpose: str = Field(..., description="Objective or purpose of the report")
    length: str = Field("Detailed", description="Desired report length")
    academic_level: str = Field("Undergraduate", description="Academic or professional target level")
    sections: List[str] = Field(
        default=["Introduction", "Problem Statement", "Objectives", "Methodology", "Results", "Discussion", "Conclusion", "Future Scope"],
        description="Sections to include in the report"
    )

class ExplainRequest(BaseModel):
    topic: str = Field(..., description="Technical topic to explain")
    difficulty: str = Field("Beginner", description="Target difficulty level (Beginner, Intermediate, Advanced)")

class ImproveRequest(BaseModel):
    text: str = Field(..., description="Raw text to improve and correct")

class PromptRequest(BaseModel):
    description: str = Field(..., description="Raw requirement or topic to generate a prompt for")

class GenericGenerateRequest(BaseModel):
    mode: str = Field(..., description="Mode name: email, report, explain, improve, or prompt")
    data: Dict[str, Any] = Field(..., description="Form fields for the mode")

class GenerationResponse(BaseModel):
    success: bool
    id: Optional[int] = None
    mode: str
    title: str
    content: str
    created_at: Optional[str] = None
    error: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    api_key_configured: bool
    model: str
    database: str
