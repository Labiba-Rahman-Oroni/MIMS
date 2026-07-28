const express = require('express');
const router  = express.Router();
const {
  getAllDoctors,
  suggestDoctors,
  getDoctorSchedule,
  getDoctorHospitals,
} = require('../controllers/doctorController');

// GET /api/doctors                      → Doctors page (all doctors, optional filter)
// GET /api/doctors/suggest/:disease_id  → Book Appointment (suggest by disease)
// GET /api/doctors/:id/schedule         → Doctors page (schedule dropdown)
// GET /api/doctors/:id/hospitals        → Book Appointment (hospital selection)

// ⚠️ /suggest/:disease_id must come BEFORE /:id
// Otherwise Express reads 'suggest' as a doctor ID
router.get('/',                    getAllDoctors);
router.get('/suggest/:disease_id', suggestDoctors);
router.get('/:id/schedule',        getDoctorSchedule);
router.get('/:id/hospitals',       getDoctorHospitals);

module.exports = router;