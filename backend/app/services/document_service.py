import os
from dotenv import load_dotenv
from google import genai
import PyPDF2
import docx

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL = "gemini-3.6-flash"


def extract_text(file_path: str):

    ext = os.path.splitext(file_path)[1].lower()

    text = ""

    # PDF
    if ext == ".pdf":
        with open(file_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)

            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"

    # DOCX
    elif ext == ".docx":
        document = docx.Document(file_path)

        for para in document.paragraphs:
            text += para.text + "\n"

    # TXT
    elif ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as file:
            text = file.read()

    else:
        raise Exception("Unsupported document format")

    return text


def analyze_document(
    file_path: str,
    prompt: str = "Summarize this document."
):

    document_text = extract_text(file_path)

    final_prompt = f"""
{prompt}

Document:

{document_text}
"""

    response = client.models.generate_content(
        model=MODEL,
        contents=final_prompt
    )

    return response.text