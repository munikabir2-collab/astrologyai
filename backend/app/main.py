
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine

# Import ALL models before create_all
from app.models.user import User
from app.models.profile import Profile
from app.models.payment import Payment

from app.routers.auth import router as auth_router
from app.routers.profile import router as profile_router
from app.routers.gemini import router as gemini_router
from app.routers.astrology import router as astrology_router
from app.routers import compatibility
from app.routers.payment import router as payment_router


# ==========================================================
# Create database tables
# ==========================================================

Base.metadata.create_all(bind=engine)


# ==========================================================
# FastAPI App
# ==========================================================

app = FastAPI(
    title="AstroAI API",
    version="1.0.0",
)


# ==========================================================
# Static files
# ==========================================================

app.mount(
    "/static",
    StaticFiles(directory="static"),
    name="static",
)


# ==========================================================
# CORS
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://astrologyai-1.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================================
# Routers
# ==========================================================

app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(gemini_router)
app.include_router(astrology_router)
app.include_router(compatibility.router)
app.include_router(payment_router)


# ==========================================================
# Home
# ==========================================================

@app.get("/")
def home():
    return {
        "message": "AstroAI API Running 🚀"
    }

