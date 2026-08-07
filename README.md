# 📍 Pata AI
### Location Intelligence for Last-Mile Delivery

Pata AI is an AI-powered multilingual address resolution platform designed for logistics and last-mile delivery. It converts unstructured delivery addresses into standardized, geocoded locations with confidence scores, audit logs, voice input, and interactive maps.

---

## 🚀 Project Overview

Last-mile delivery often suffers from inaccurate or incomplete addresses, leading to delayed deliveries, increased operational costs, and poor customer experience.

Pata AI solves this problem by:

- Parsing multilingual delivery addresses
- Standardizing address formats
- Verifying landmarks and pincodes
- Generating confidence scores
- Displaying resolved locations on an interactive map
- Supporting voice-based address input

---

# ✨ Features

## 🌍 Multilingual Address Parsing

Supports:

- English
- Hindi
- Telugu
- Tamil

---

## 🎤 Voice Input

Users can speak delivery addresses using browser speech recognition.

---

## 🧠 AI Address Resolution

- Address normalization
- Landmark verification
- Area identification
- City detection
- Pincode extraction

---

## 📍 Interactive Map

Displays resolved delivery locations using:

- Leaflet.js
- OpenStreetMap

---

## 📊 Confidence Score

Each resolved address receives an AI confidence score.

Example:

- 98% High Confidence
- 96% High Confidence
- 93% High Confidence
- 50% Low Confidence

---

## 📝 Audit Log

Maintains complete traceability by storing:

- Original Address
- Corrected Address
- Confidence
- Reason
- Revert Action

---

## 🌐 Geoapify Integration

Unknown addresses are automatically resolved using the Geoapify Geocoding API.

---

# 🏗 Architecture

                User
                  │
                  ▼
         React Frontend (Pata AI)
                  │
      Voice / Text Address Input
                  │
                  ▼
        FastAPI Backend (Python)
                  │
      ┌───────────┴───────────┐
      │                       │
Known Demo Address     Geoapify API
      │                       │
      └───────────┬───────────┘
                  ▼
        Parsed Address Engine
                  │
                  ▼
     Confidence & Audit Generator
                  │
                  ▼
      Leaflet Interactive Map

---

# 🛠 Tech Stack

## Frontend

- React.js
- Tailwind CSS
- React Leaflet
- Lucide React

## Backend

- Python
- FastAPI
- Pydantic

## APIs

- Geoapify Geocoding API
- Web Speech API

## Maps

- Leaflet.js
- OpenStreetMap

---

# 📂 Project Structure

Pata-AI/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── models/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │    └── AddressResolver/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md

---

# ⚙️ Installation

## Clone Repository

git clone https://github.com/yourusername/Pata-AI.git

---

## Backend

cd backend

pip install -r requirements.txt

uvicorn main:app --reload

Backend runs on:

http://127.0.0.1:8000

---

## Frontend

cd frontend

npm install

npm run dev

Frontend runs on:

http://localhost:5173

---

# 🔑 Geoapify API Setup

1. Create a free account at

https://www.geoapify.com/

2. Generate an API Key

3. Replace the API key inside

main.py

---

# 📸 Screenshots

## Home Page

(Add Screenshot)

---

## Voice Input

(Add Screenshot)

---

## Address Resolution

(Add Screenshot)

---

## Interactive Map

(Add Screenshot)

---

## Audit Log

(Add Screenshot)

---

# 📈 Workflow

1. User enters delivery address
2. Voice or text input accepted
3. Backend processes address
4. Demo addresses resolved locally
5. Unknown addresses resolved using Geoapify
6. Parsed address generated
7. Confidence score calculated
8. Audit log created
9. Interactive map displayed

---

# 🎯 Future Enhancements

- Google Maps Integration
- Route Optimization
- ETA Prediction
- Delivery Agent Dashboard
- Blockchain Audit Trail
- OCR Address Detection
- QR Code Delivery Support

---

# 👨‍💻 Team

Track 1 – Last Mile & Field Operations

Team Members
