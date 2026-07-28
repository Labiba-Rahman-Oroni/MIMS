const db = require('../db');

/*
 * GET /api/diseases
 * Used on: Book Appointment page (disease dropdown)
 *
 * WHY: Patient picks their disease first when booking.
 *      We show the specialization name alongside each disease
 *      so patients understand which type of doctor treats it.
 *
 * HOW: JOIN Specialization to convert specialization_id
 *      into a readable name like 'Cardiology'.
 */
const getAllDiseases = (req, res) => {
  const query = `
    SELECT
      d.disease_id,
      d.name,
      d.icd_code,
      s.name AS specialization_name
    FROM Disease d
    JOIN Specialization s ON d.specialization_id = s.specialization_id
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

module.exports = { getAllDiseases };