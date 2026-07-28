const express = require('express');
const router  = express.Router();
const { getPatientHistory } = require('../controllers/medicalHistoryController');

// GET /api/medical-history/:id → Medical History page
router.get('/:id', getPatientHistory);

module.exports = router;