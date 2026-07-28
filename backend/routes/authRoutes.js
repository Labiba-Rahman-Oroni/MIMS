const express = require('express');
const router  = express.Router();
const db      = require('../db');

/*
 * POST /api/auth/login
 * Used on: Login page
 * Patient logs in with phone number — no password needed.
 */
router.post('/login', (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  db.query(
    'SELECT * FROM Patient WHERE phone = ?',
    [phone],
    (err, results) => {
      if (err)                return res.status(500).json({ message: 'Server error' });
      if (!results.length)    return res.status(404).json({ message: 'Patient not found' });
      res.json({ message: 'Login successful', patient: results[0] });
    }
  );
});

module.exports = router;