# 📍 Pata – AI Location Intelligence for Last-Mile Delivery

An AI-powered Location Intelligence System that converts messy Indian addresses into standardized addresses using Gemini AI, verifies them with OpenStreetMap (OSM), and visualizes the verified location on an interactive map.

---

# 🚀 Project Overview

Indian delivery addresses are often incomplete, inconsistent, multilingual, or contain only landmarks.

Example:

door no 3-111

or

klu vaddeswaram

or

opp ranga bomma chakrayapalem

Traditional geocoders fail to locate these addresses accurately.

Pata solves this problem using Artificial Intelligence to understand, standardize, verify, and geocode Indian addresses.

---

# ✨ Features

## 🤖 AI Address Parsing

Uses Google Gemini AI to

- Detect language
- Translate to English
- Correct spelling mistakes
- Standardize address
- Extract landmark
- Extract locality
- Extract city
- Extract state
- Extract pincode

---

## 📍 Smart Address Standardization

Messy input

klu vaddeswaram

↓

Standardized Output

Koneru Lakshmaiah Education Foundation (KL University),
Vaddeswaram,
Guntur District,
Andhra Pradesh,
522502

---

## 🌍 OpenStreetMap Geocoding

The standardized address is passed to OpenStreetMap (Nominatim) to obtain

- Latitude
- Longitude

instead of geocoding the raw user input.

This significantly improves mapping accuracy.

---

## 🗺 Interactive Map

Displays

- Verified marker
- Accuracy circle
- Landmark tooltip
- Popup containing
  - Corrected Address
  - Landmark
  - Coordinates
  - Confidence Score

---

## 🎤 Voice Input

Supports speech recognition using

Web Speech API

Users can speak the address instead of typing.

---

## 📊 AI Confidence Score

Displays confidence based on

- City identified
- State identified
- Locality identified
- Landmark extracted
- Pincode extracted
- Address standardized
- India Post verification

---

## 📋 Evidence Panel

Shows why the address received its confidence score.

Example

- City identified
- Landmark extracted
- Pincode verified
- Address standardized

---

# 🏗 System Architecture

                 User Input
                     │
                     ▼
        Messy Indian Address
                     │
                     ▼
             Gemini AI Parser
                     │
                     ▼
      Standardized Address Generation
                     │
                     ▼
         OpenStreetMap Geocoder
                     │
                     ▼
      Latitude & Longitude Extraction
                     │
                     ▼
          FastAPI REST API Response
                     │
                     ▼
             React Dashboard
                     │
                     ▼
     Leaflet Interactive Street Map

---

# 🛠 Tech Stack

## Frontend

- React.js
- Tailwind CSS
- React Leaflet
- Leaflet
- Web Speech API

---

## Backend

- FastAPI
- Python
- Google Gemini API
- OpenStreetMap Nominatim
- India Post Pincode Dataset

---

## AI

- Gemini 3.5 Flash

---

## Mapping

- OpenStreetMap
- Leaflet

---

# 📂 Project Structure

Location-Intelligence/
│
├── backend/
│   ├── main.py
│   ├── services/
│   │      gemini_service.py
│   │      geocoder.py
│   │      confidence.py
│   │      pincode_service.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │
│   ├── components/
│   │      AddressResolver/
│   │      Dashboard/
│   │      Map/
│   │
│   └── package.json
│
└── README.md

---

# ⚙️ Installation

## Backend

cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload

Backend runs on

http://127.0.0.1:8000

---

## Frontend

cd frontend

npm install

npm run dev

Frontend runs on

http://localhost:5173

---

# 🔑 Environment Variables

Create a .env file inside the backend folder.

GEMINI_API_KEY=YOUR_API_KEY

---

# 🔄 Address Resolution Workflow
[08-08-2026 11:56] 2300032540_CHANDANA RAJA SRI_CSE: 1. User enters a messy address.
2. Gemini AI parses and standardizes the address.
3. AI extracts
   - Landmark
   - Locality
   - City
   - State
   - Pincode
4. Standardized address is sent to OpenStreetMap.
5. OpenStreetMap returns latitude and longitude.
6. Backend computes confidence score.
7. React displays:
   - Standardized address
   - Confidence score
   - Verification evidence
   - Interactive map

---

# 📸 Sample Input

klu vaddeswaram

Output

Corrected Address

Koneru Lakshmaiah Education Foundation
Vaddeswaram
Guntur
Andhra Pradesh
522502

Map

✔️ Marker placed at verified location

---

Input

door no 3-111 near ranga bomma chakrayapalem

Output

Door No 3-111
Near Ranga Bomma
Chakrayapalem
Pedakurapadu
Guntur
522402

---

# 📸 Screenshots

## Home Page

[<img width="1918" height="965" alt="Screenshot 2026-08-08 114229" src="https://github.com/user-attachments/assets/03a88f9b-5f87-4c5f-b19e-fc9500bcb9f9" />](https://drive.google.com/file/d/1VYRcVU5kmUXpgK50Yhibi3aSXqwtP5il/view?usp=sharing)


---

## Voice Input

[<img width="1917" height="962" alt="image" src="https://github.com/user-attachments/assets/7c3957cf-32a5-4f17-a48d-b75a1fa3d7b7" />](https://drive.google.com/file/d/1FyfZl7ChM893tFVkfnmF5ioaqY1hvepc/view?usp=sharing)


---

## Address Resolution

[<img width="882" height="911" alt="image" src="https://github.com/user-attachments/assets/536c64dc-78e6-4ab5-9fa1-c08e41ed2e56" />](https://drive.google.com/file/d/1fWcILeCwr6CUAnt73QPoi_3RqVGatRme/view?usp=sharing)


---

## Interactive Map

<img width="608" height="589" alt="image" src="https://github.com/user-attachments/assets/d20ae2c4-adeb-4a57-b048-f535d676fc48" />


---


# 📈 Future Enhancements

- Google Places API integration
- Reverse geocoding
- Route optimization
- Delivery ETA prediction
- Multi-language voice assistant
- Offline pincode lookup
- Duplicate address detection
- Delivery analytics dashboard

---

# 🎯 Applications

- E-commerce Delivery
- Logistics
- Courier Services
- Food Delivery
- Emergency Response
- Smart City Navigation
- Postal Address Verification

---
