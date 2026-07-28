const db = require('../db');

/*
 * GET /api/medical-history/:id
 * Used on: Medical History page
 *
 * WHY: Shows every past visit with full details —
 *      doctor, hospital, disease, medicines prescribed.
 *      Joining 10 tables here would make this messy.
 *
 * HOW: Uses PatientMedicalHistoryView — a VIEW saved
 *      in the database that already has all 10 tables
 *      joined inside it.
 *      We just SELECT from it like a normal table.
 *      WHERE patient_id = ? filters to this patient.
 */
const getPatientHistory = (req, res) => {
  const { id } = req.params;

  db.query(
    `SELECT *
     FROM   PatientMedicalHistoryView
     WHERE  patient_id = ?
     ORDER BY recorded_at DESC`,
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Server error' });
      res.json(results);
    }
  );
};

module.exports = { getPatientHistory };