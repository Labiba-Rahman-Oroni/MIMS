const express = require('express');
const router  = express.Router();
const {
  bookAppointment,
  getPatientAppointments,
  cancelAppointment,
} = require('../controllers/appointmentController');

// POST /api/appointments/book          → Book Appointment page
// GET  /api/appointments/patient/:id   → My Appointments page
// PUT  /api/appointments/:id/cancel    → My Appointments (cancel button)

router.post('/book',       bookAppointment);
router.get('/patient/:id', getPatientAppointments);
router.put('/:id/cancel',  cancelAppointment);

module.exports = router;