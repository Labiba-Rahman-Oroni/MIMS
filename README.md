<<<<<<< HEAD
# 🏥 MIMS — Medical Information Management System

A full-stack web application for managing medical appointments, prescriptions, and patient history.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MySQL
- **API:** REST

## Features
- 🔐 Patient login by phone number
- 📅 Book appointments with doctor suggestions by disease
- 💊 View prescriptions with medicine substitutes
- 📁 Full medical history via SQL VIEW
- 🧪 Medicine search with alternatives
- 👤 Patient profile with stats


## Project Structure
MIMS_V2/
├── backend/          # Node.js + Express API
│   ├── controllers/  # Business logic
│   ├── routes/       # API endpoints
│   ├── db.js         # MySQL connection pool
│   └── server.js     # Entry point
├── frontend/         # React + Vite
│   └── src/
│       ├── pages/    # All pages
│       ├── components/ # Reusable components
│       └── api/      # Axios API calls
└── database/
└── schema.sql    # Full schema + sample data

## Setup Instructions

### 1. Database
```bash
mysql -u root -h 127.0.0.1 < database/schema.sql
```

### 2. Backend
```bash
cd backend
npm install
```
Create `.env` file:
PORT=5001
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=MIMS_V2
```bash
node server.js
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## Test Login
Use any patient phone number from the sample data:
- `01711000001` — Rahim Uddin
- `01711000002` — Fatema Begum
- `01711000003` — Karim Hossain

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Patient login |
| GET | /api/patients/:id/medications | Active medications |
| GET | /api/patients/:id/prescriptions | All prescriptions |
| GET | /api/patients/:id/summary | Patient profile |
| GET | /api/doctors | All doctors |
| GET | /api/doctors/suggest/:disease_id | Suggest by disease |
| GET | /api/appointments/patient/:id | Patient appointments |
| POST | /api/appointments/book | Book appointment |
| PUT | /api/appointments/:id/cancel | Cancel appointment |
| GET | /api/medicines | All medicines |
| GET | /api/medicines/alternatives/:id | Medicine substitutes |
| GET | /api/medical-history/:id | Medical history |

=======
# MIMS
⸻

🏥 PROJECT TITLE

Medical Information Management System (MIMS)

⸻

📄 PROJECT DESCRIPTION

🔹 Introduction

The Medical Information Management System (MIMS) is a database-driven system designed to efficiently manage healthcare data related to patients, doctors, hospitals, appointments, prescriptions, and medicines. The system ensures proper organization, retrieval, and management of medical information to support better healthcare services.

⸻

🔹 Objectives

The main objectives of this system are:

* To maintain structured records of patients and their medical information
* To manage doctor details, specializations, and hospital schedules
* To facilitate appointment booking between patients and doctors
* To store prescriptions and prescribed medicines
* To support medicine substitution using generic composition
* To maintain patient medical history for future reference

⸻

🔹 System Overview

The system consists of several interconnected modules:

👤 Patient Management

Stores patient information including personal details, contact, and physical attributes like weight and height. Each patient is linked to a medical history.

⸻

👨‍⚕️ Doctor & Specialization

Doctors are registered with unique license numbers. Each doctor can have multiple specializations, and each specialization can be associated with multiple doctors.

⸻

🏥 Hospital & Scheduling

Doctors can work in multiple hospitals at different times. This is managed through a DoctorSchedule entity which records working days and time slots.

⸻

📅 Appointment System

Patients can book appointments with doctors in specific hospitals. Each appointment has a status and token number.

⸻

📄 Prescription System

Each appointment generates exactly one prescription. The prescription contains diagnosis notes and prescribed medicines.

⸻

💊 Medicine & Generic System

Each medicine belongs to a generic (compound). If a specific medicine is unavailable, alternative medicines with the same generic and strength can be suggested.

⸻

🏥 Medical History

Each patient has a medical history that stores all prescriptions over time, allowing doctors to review past treatments.

⸻

🔹 Key Features

* Doctor suggestion based on specialization
* Medicine substitution using generic composition
* Multi-hospital doctor scheduling
* Structured appointment system
* Centralized patient medical history

⸻

🔹 Database Design Concepts Used

* Entity-Relationship modeling
* Normalization (up to 3NF)
* Primary and Foreign Keys
* Many-to-Many relationships resolved using associative tables
* Constraints (UNIQUE, CHECK, NOT NULL)
>>>>>>> 0ed3502db0a1b6f662b66ebdbcfbe95613d655ef
