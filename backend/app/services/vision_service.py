import os
from dotenv import load_dotenv
from google import genai
from PIL import Image

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = "models/gemini-3.6-flash"


def analyze_image(image_path: str, prompt: str = "Describe this image."):

    try:
        image = Image.open(image_path)

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[
                prompt,
                image
            ]
        )

        return response.text

    except Exception as e:
        return f"Vision Error: {str(e)}"