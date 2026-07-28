const express = require('express');
const router  = express.Router();
const { getAllSpecializations } = require('../controllers/specializationController');

// GET /api/specializations → Doctors page (filter buttons)
router.get('/', getAllSpecializations);

module.exports = router;