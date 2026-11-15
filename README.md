# CareConnect AI – Elderly Care & Medication Management Platform

CareConnect AI is an elderly-care and medication management platform designed to help caregivers organize medication information, track doses, and manage doctor appointments.

This project was developed for the **Hack2Skill PromptWars × Catalyst Challenge**.

## Project Overview

CareConnect AI aims to simplify elderly care by bringing essential medication and appointment management features into one platform.

## Key Features

- **Medication Management:** Add, view, update, and delete medication records.
- **Dose Tracking:** Record medication doses and update their status.
- **Appointment Management:** Organize doctor appointments and manage appointment records.
- **Care Dashboard:** Access care-related information through a centralized frontend.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, CSS |
| Backend | Python, FastAPI |
| Database | SQLite |
| API | REST API |
| Version Control | Git, GitHub |

## Project Structure

```text
CareConnect-AI/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   ├── routers/
│   │   ├── appointments.py
│   │   ├── caregivers.py
│   │   └── medications.py
│   └── services/
│       └── reminders.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Getting Started

### Prerequisites

- Python 3
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ajayreddyalluri/CareConnect-AI.git
cd CareConnect-AI
```

### 2. Start the Backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

**Windows PowerShell**
```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

Backend: `http://127.0.0.1:8000`

API documentation: `http://127.0.0.1:8000/docs`

### 3. Start the Frontend

Open another terminal:

```bash
cd CareConnect-AI/frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## API Functionality

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/medications/` | Retrieve medications |
| POST | `/medications/` | Add medication |
| GET | `/medications/{id}` | Retrieve a medication |
| PUT | `/medications/{id}` | Update medication |
| DELETE | `/medications/{id}` | Delete medication |
| GET | `/medications/{id}/doses` | Retrieve dose records |
| POST | `/medications/{id}/doses` | Record a dose |
| PATCH | `/medications/doses/{dose_id}` | Update dose status |
| GET | `/appointments/` | Retrieve appointments |
| POST | `/appointments/` | Create appointment |
| DELETE | `/appointments/{id}` | Delete appointment |

## Future Enhancements

- AI-powered healthcare report summarization
- Automated medication reminders
- Secure caregiver and family access
- Health record management
- Emergency assistance features

## Current Project Status

This repository contains the frontend and backend implementation for the medication and appointment management MVP. Cloud deployment and additional features are planned enhancements.

## Author

**Alluri Ajay Reddy**

GitHub: https://github.com/ajayreddyalluri

---

*CareConnect AI – Supporting better elderly care through technology.*
