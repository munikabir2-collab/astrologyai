# 🔮 AstroAI - AI Powered Vedic Astrology Platform

![AstroAI Banner](https://via.placeholder.com/1200x400.png?text=AstroAI+-+AI+Vedic+Astrology)

AstroAI is a modern **AI-powered Vedic Astrology platform** built with **FastAPI, React, PostgreSQL, Google Gemini AI, and Swiss Ephemeris**.

The platform combines traditional Vedic astrology calculations with Artificial Intelligence to provide personalized horoscope analysis, Kundli generation, predictions, and interactive AI astrology consultation.

---

## ✨ Features

### 🔮 Astrology Engine

* ✅ Birth Chart (Janam Kundli) Generation
* ✅ Horoscope Prediction
* ✅ Rashi & Nakshatra Analysis
* ✅ Planetary Position Calculation
* ✅ Dasha Analysis
* ✅ Transit Analysis
* ✅ Panchang Calculation
* ✅ Muhurat Finder
* ✅ Compatibility Matching

---

### 🤖 AI Features

* ✅ Gemini AI Astrology Assistant
* ✅ AI Generated Horoscope Reports
* ✅ AI Kundli Interpretation
* ✅ Voice Astrology Support
* ✅ Text-to-Speech Support
* ✅ Speech-to-Text Support
* ✅ Document AI Processing
* ✅ Image AI Analysis

---

### 📄 Report Generation

* Professional PDF Astrology Reports
* Hindi / English Unicode Support
* Devanagari Font Support
* Downloadable Kundli Reports

---

## 🏗️ System Architecture

```
                 User
                  |
                  |
          React Frontend
                  |
                  |
             FastAPI Backend
                  |
        ---------------------
        |                   |
   Astrology Engine     Gemini AI
        |
   Swiss Ephemeris
        |
    PostgreSQL Database
```

---

# 🛠️ Tech Stack

## Backend

* Python 3.11
* FastAPI
* SQLAlchemy
* PostgreSQL
* Pydantic
* JWT Authentication
* Google Gemini AI API
* Swiss Ephemeris (pyswisseph)
* ReportLab PDF Generator

---

## Frontend

* React
* Vite
* JavaScript
* CSS
* Axios
* React Router

---

# 📂 Project Structure

```
astrologyai/

│
├── backend/
│
│   ├── app/
│   │
│   ├── routers/
│   ├── services/
│   ├── models/
│   ├── schemas/
│   ├── utils/
│   │
│   ├── fonts/
│   ├── sweph/
│   ├── requirements.txt
│   └── main.py
│
│
└── frontend/
    
    ├── src/
    │
    ├── components/
    ├── pages/
    ├── api/
    │
    ├── package.json
    └── vite.config.js
```

---

# 🚀 Installation Guide

## Clone Repository

```bash
git clone https://github.com/munikabir2-collab/astrologyai.git

cd astrologyai
```

---

# Backend Setup

Go to backend:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv venv
```

Activate:

Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` file:

```
DATABASE_URL=your_postgresql_url

SECRET_KEY=your_secret_key

GEMINI_API_KEY=your_gemini_api_key
```

Run server:

```bash
uvicorn app.main:app --reload
```

Backend will start:

```
http://localhost:8000
```

API Docs:

```
http://localhost:8000/docs
```

---

# Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Start React app:

```bash
npm run dev
```

Frontend:

```
http://localhost:5173
```

---

# 🔌 API Modules

## Authentication

```
POST /auth/register

POST /auth/login
```

---

## Astrology

```
GET  /astrology/prediction

POST /astrology/horoscope

POST /astrology/kundli

GET /astrology/panchang

GET /astrology/dasha

GET /astrology/download-pdf
```

---

## Gemini AI

```
POST /gemini/chat
```

---

# 🔐 Security

Implemented:

* JWT Authentication
* Password Hashing
* Environment Variables
* Protected API Routes
* Database Security

---

# 📸 Screenshots

(Add your application screenshots here)

```
Frontend Dashboard
Kundli Page
Gemini Chat
PDF Report
```

---

# 🌟 Future Roadmap

* [ ] Mobile App (Flutter)
* [ ] Payment Subscription System
* [ ] Live Astrologer Consultation
* [ ] AI Voice Assistant
* [ ] Multi-language Support
* [ ] Advanced Birth Chart Visualization
* [ ] Cloud Deployment

---

# 🌍 Deployment

Recommended:

Frontend:

* Vercel

Backend:

* Render / Railway

Database:

* PostgreSQL

---

# 👨‍💻 Author

**Munilal Tanti**

GitHub:

https://github.com/munikabir2-collab

---

# ⭐ Support

If you like this project, please consider giving it a ⭐ on GitHub.

---

## License

This project is currently for educational and development purposes.
