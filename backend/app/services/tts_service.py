import os
from pathlib import Path
from gtts import gTTS

OUTPUT_DIR = "uploads/tts"
Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)


def text_to_speech(text: str, language="hi"):

    filename = "speech.mp3"

    filepath = os.path.join(
        OUTPUT_DIR,
        filename
    )

    tts = gTTS(
        text=text,
        lang=language,
        slow=False
    )

    tts.save(filepath)

    return filepath