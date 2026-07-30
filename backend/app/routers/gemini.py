from fastapi import APIRouter, UploadFile, File, Form
from pydantic import BaseModel
import os
import shutil

from app.services.gemini_service import ask_gemini
from app.services.vision_service import analyze_image
from app.services.audio_service import analyze_audio
from app.services.document_service import analyze_document
from app.services.translate_service import translate_text

from app.services.stt_service import speech_to_text
from app.services.tts_service import text_to_speech
from app.services.speech_service import speech_to_speech

router = APIRouter(
    prefix="/gemini",
    tags=["Gemini AI"]
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ==========================================
# CHAT
# ==========================================

class Prompt(BaseModel):
    prompt: str


@router.post("/chat")
def chat(data: Prompt):

    return {
        "response": ask_gemini(data.prompt)
    }


# ==========================================
# IMAGE AI
# ==========================================

@router.post("/image")
async def image_ai(
    file: UploadFile = File(...),
    prompt: str = Form("Describe this image.")
):

    filepath = os.path.join(UPLOAD_DIR, file.filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = analyze_image(filepath, prompt)

    return {
        "filename": file.filename,
        "result": result
    }


# ==========================================
# AUDIO AI
# ==========================================

@router.post("/audio")
async def audio_ai(
    file: UploadFile = File(...),
    prompt: str = Form("Transcribe this audio.")
):

    filepath = os.path.join(UPLOAD_DIR, file.filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = analyze_audio(filepath, prompt)

    return {
        "filename": file.filename,
        "result": result
    }


# ==========================================
# DOCUMENT AI
# ==========================================

@router.post("/document")
async def document_ai(
    file: UploadFile = File(...),
    prompt: str = Form("Summarize this document.")
):

    filepath = os.path.join(UPLOAD_DIR, file.filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = analyze_document(filepath, prompt)

    return {
        "filename": file.filename,
        "result": result
    }


# ==========================================
# TRANSLATE
# ==========================================

class TranslateRequest(BaseModel):
    text: str
    target_language: str


@router.post("/translate")
def translate(data: TranslateRequest):

    result = translate_text(
        data.text,
        data.target_language
    )

    return {
        "translated_text": result
    }


# ==========================================
# SPEECH TO TEXT
# ==========================================

@router.post("/stt")
async def stt(
    file: UploadFile = File(...)
):

    filepath = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    transcript = speech_to_text(filepath)

    return {
        "transcript": transcript
    }


# ==========================================
# TEXT TO SPEECH
# ==========================================

class TTSRequest(BaseModel):
    text: str


@router.post("/tts")
def tts(data: TTSRequest):

    audio_file = text_to_speech(data.text)

    return {
        "audio": audio_file
    }


# ==========================================
# SPEECH TO SPEECH
# ==========================================

@router.post("/speech")
async def speech(
    file: UploadFile = File(...)
):

    filepath = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = speech_to_speech(filepath)

    return result


@router.post("/speech-chat")
async def speech_chat(file: UploadFile = File(...)):
    filepath = os.path.join("uploads", file.filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    transcript = speech_to_text(filepath)

    ai_reply = ask_gemini(transcript)

    audio_path = text_to_speech(ai_reply)

    return {
        "transcript": transcript,
        "text": ai_reply,
        "audio_url": audio_path
    }
