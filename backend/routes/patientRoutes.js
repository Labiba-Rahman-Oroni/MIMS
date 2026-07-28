const express = require('express');
const router  = express.Router();
const {
  getLatestMedications,
  getPatientPrescriptions,
  getPatientSummary,
} = require('../controllers/patientController');

// GET /api/patients/:id/medications   → Dashboard (current medicines)
// GET /api/patients/:id/prescriptions → Prescriptions page
// GET /api/patients/:id/summary       → Dashboard + Profile page

router.get('/:id/medications',   getLatestMedications);
router.get('/:id/prescriptions', getPatientPrescriptions);
router.get('/:id/summary',       getPatientSummary);

module.exports = router;