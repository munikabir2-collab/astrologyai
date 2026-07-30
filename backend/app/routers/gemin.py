from fastapi import APIRouter
from pydantic import BaseModel

from app.services.gemini_service import ask_gemini

router = APIRouter(
    prefix="/gemini",
    tags=["Gemini AI"]
)


class Prompt(BaseModel):
    prompt: str


@router.post("/")
def chat(data: Prompt):
    return {
        "response": ask_gemini(data.prompt)
    }