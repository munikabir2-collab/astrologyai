from app.services.stt_service import speech_to_text
from app.services.gemini_service import ask_gemini
from app.services.tts_service import text_to_speech


def speech_to_speech(audio_path: str):

    # Step 1
    transcript = speech_to_text(audio_path)

    # Step 2
    ai_response = ask_gemini(transcript)

    # Step 3
    voice_file = text_to_speech(ai_response)

    return {
        "transcript": transcript,
        "response": ai_response,
        "voice": voice_file
    }