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

