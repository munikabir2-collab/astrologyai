import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise Exception("GEMINI_API_KEY missing in .env")

client = genai.Client(api_key=API_KEY)

# Latest available models (fallback order)
MODELS = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-2.0-flash",
]

chat = None


def create_chat():
    global chat

    last_error = None

    for model in MODELS:
        try:
            print(f"Creating chat with {model}")

            chat = client.chats.create(model=model)

            print(f"Using Gemini Model: {model}")

            return

        except Exception as e:
            print(f"{model} failed:", e)
            last_error = e

    raise Exception(f"Unable to create Gemini chat.\n{last_error}")


# Create chat when server starts
create_chat()


def ask_gemini(prompt: str) -> str:
    global chat

    try:
        response = chat.send_message(prompt)

        if response.text:
            return response.text

        return "No response from Gemini."

    except Exception as e:
        print("Gemini Error:", e)
        return f"Gemini Error: {e}"


def clear_chat():
    create_chat()




def ask_gemini_image(prompt: str, image_bytes: bytes, mime_type: str):

    try:

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                types.Part.from_bytes(
                    data=image_bytes,
                    mime_type=mime_type,
                ),
                prompt,
            ],
        )

        return response.text

    except Exception as e:
        print("Gemini Image Error:", e)
        return f"Gemini Error: {e}"
