const express = require('express');
const router  = express.Router();
const { getAllMedicines, getSubstitutes } = require('../controllers/medicineController');

/*
 * GET /api/medicines?search=Napa&strength=500
 * → Medicines page — live search bar
 *
 * GET /api/medicines/alternatives/:medicine_id
 * → Medicines page — Show Substitutes button
 *
 * ⚠️ IMPORTANT: /alternatives/:medicine_id MUST come before /:id
 * If /:id comes first, Express reads 'alternatives' as a medicine ID
 * and tries to find medicine with id='alternatives' → fails
 */
router.get('/',                          getAllMedicines);
router.get('/alternatives/:medicine_id', getSubstitutes);

module.exports = router;