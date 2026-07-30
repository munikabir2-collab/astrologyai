import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = "models/gemini-3.6-flash"


def translate_text(text: str, target_language: str):

    prompt = f"""
Translate the following text into {target_language}.

Rules:
- Return ONLY the translated text.
- Do not explain.
- Do not use markdown.

Text:
{text}
"""

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )

        return response.text

    except Exception as e:
        return f"Translation Error: {str(e)}"