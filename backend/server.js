require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

/*
 * cors()         → lets React (port 5173) talk to this backend (port 5001)
 * express.json() → lets us read JSON from req.body
 */
app.use(cors());
app.use(express.json());

/*
 * Only the routes that are actually used by the frontend.
 * Every other route file has been removed.
 */
app.use('/api/auth',            require('./routes/authRoutes'));
app.use('/api/patients',        require('./routes/patientRoutes'));
app.use('/api/doctors',         require('./routes/doctorRoutes'));
app.use('/api/appointments',    require('./routes/appointmentRoutes'));
app.use('/api/medicines',       require('./routes/medicineRoutes'));
app.use('/api/diseases',        require('./routes/diseaseRoutes'));
app.use('/api/specializations', require('./routes/specializationRoutes'));
app.use('/api/medical-history', require('./routes/medicalHistoryRoutes'));

app.get('/', (req, res) => res.send('MIMS V2 Backend Running 🚀'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));