from pydantic import BaseModel, Field
from typing import List


class ResumeEvaluation(BaseModel):
    overall_score: int = Field(ge=0, le=100, description="Overall resume quality score")
    summary: str = Field(description="2-3 sentence overall assessment")
    strengths: List[str] = Field(description="Concrete strengths found in the resume")
    weaknesses: List[str] = Field(description="Specific gaps or problems")
    missing_keywords: List[str] = Field(description="Relevant skills/keywords absent, given the target role")
    suggestions: List[str] = Field(description="Actionable, prioritized improvements")
    ats_compatibility_notes: str = Field(description="Formatting/ATS observations")