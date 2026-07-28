const express = require('express');
const router  = express.Router();
const { getAllDiseases } = require('../controllers/diseaseController');

// GET /api/diseases → Book Appointment page (disease dropdown)
router.get('/', getAllDiseases);

module.exports = router;