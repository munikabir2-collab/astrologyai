import os
import mimetypes

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = "models/gemini-3.6-flash"


def speech_to_text(audio_path: str):

    try:

        with open(audio_path, "rb") as f:
            audio = f.read()

        mime_type = (
            mimetypes.guess_type(audio_path)[0]
            or "audio/mpeg"
        )

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[
                "Transcribe this audio accurately. Return only the transcript.",
                types.Part.from_bytes(
                    data=audio,
                    mime_type=mime_type
                )
            ]
        )

        return response.text

    except Exception as e:

        return f"Speech To Text Error: {str(e)}"