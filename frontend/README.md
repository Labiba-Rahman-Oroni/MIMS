# MIMS V2 — Medical Information Management System

A full-stack web application for managing patient medical records,
appointments, prescriptions, and medicines.

## Tech Stack
- **Backend:** Node.js + Express + MySQL (raw SQL, no ORM)
- **Frontend:** React + Vite + Tailwind CSS
- **Database:** MySQL (MIMS_V2)

## Features
- Patient login by phone number
- Book appointments with suggested doctors by disease
- View prescriptions with multiple medicines
- Live medicine search by trade name or generic name
- Medicine substitute finder
- Full medical history via SQL VIEW

## Project Structure
\`\`\`
MIMS_V2/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── db.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
├── database/
│   └── schema.sql
└── README.md
\`\`\`

## Setup

### Database
\`\`\`bash
mysql -u root -h 127.0.0.1 < database/schema.sql
\`\`\`

### Backend
\`\`\`bash
cd backend
npm install
node server.js
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## Login
Use any phone number from the sample data.
Demo: \`01711000001\`

## Team
- Person 1 — Patient & Appointment queries (Q1, Q5, Q13, Q14, Q15)
- Person 2 — Doctor & Specialization queries (Q2, Q3, Q4, Q11, Q12)
- Person 3 — Medicine & Prescription queries (Q6, Q7, Q8, Q9, Q10)