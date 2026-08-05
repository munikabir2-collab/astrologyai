from fastapi import UploadFile
import json

from app.services.gemini_service import ask_gemini_image


async def analyze_palm(name: str, image: UploadFile):

    image_bytes = await image.read()

    prompt = f"""
You are an expert Palm Reader.

Analyze this palm image of {name}.

Return ONLY JSON.

{{
  "palm_type":"",
  "element":"",
  "personality":"",
  "heart_line":"",
  "head_line":"",
  "life_line":"",
  "fate_line":"",
  "career":"",
  "love":"",
  "health":"",
  "wealth":"",
  "strengths":["","",""],
  "weaknesses":["",""],
  "remedies":["","",""],
  "ai_report":""
}}
"""

    text = ask_gemini_image(
        prompt,
        image_bytes,
        image.content_type,
    )

    text = text.replace("```json", "")
    text = text.replace("```", "").strip()

    try:
        return json.loads(text)

    except Exception:
        return {
            "palm_type": "Unknown",
            "element": "Unknown",
            "personality": text,
            "heart_line": "",
            "head_line": "",
            "life_line": "",
            "fate_line": "",
            "career": "",
            "love": "",
            "health": "",
            "wealth": "",
            "strengths": [],
            "weaknesses": [],
            "remedies": [],
            "ai_report": text,
        }