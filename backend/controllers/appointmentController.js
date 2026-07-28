const db = require('../db');

/*
 * POST /api/appointments/book
 * Used on: Book Appointment page
 *
 * WHY: New appointments need a token number showing
 *      their position in that doctor's queue for the day.
 *
 * HOW: Query 1 — counts existing appointments for same
 *      doctor + hospital + date, then adds 1 for next token.
 *      Query 2 — inserts the appointment with that token.
 */
const bookAppointment = (req, res) => {
  const {
    patient_id, doctor_id, hospital_id,
    disease_id, appointment_date, appointment_time,
  } = req.body;

  // Step 1: calculate next token number
  db.query(
    `SELECT COUNT(*) + 1 AS next_token
     FROM Appointment
     WHERE doctor_id        = ?
     AND   hospital_id      = ?
     AND   appointment_date = ?`,
    [doctor_id, hospital_id, appointment_date],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Server error' });

      const token = result[0].next_token;

      // Step 2: insert the appointment
      db.query(
        `INSERT INTO Appointment
           (patient_id, doctor_id, hospital_id, disease_id,
            appointment_date, appointment_time, status, token_number)
         VALUES (?, ?, ?, ?, ?, ?, 'Booked', ?)`,
        [patient_id, doctor_id, hospital_id, disease_id,
         appointment_date, appointment_time, token],
        (err) => {
          if (err) return res.status(500).json({ message: 'Server error' });
          res.json({ message: 'Appointment booked', token });
        }
      );
    }
  );
};

/*
 * GET /api/appointments/patient/:id
 * Used on: My Appointments page
 *
 * WHY: Shows the patient all their bookings with full details.
 *      Appointment table only stores IDs, not names.
 *
 * HOW: JOIN Doctor, Hospital, Disease to get display names.
 *      ORDER BY DESC → newest appointments shown first.
 */
const getPatientAppointments = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT
      a.appointment_id,
      a.appointment_date,
      a.appointment_time,
      a.status,
      a.token_number,
      d.full_name        AS doctor_name,
      d.consultation_fee,
      h.name             AS hospital_name,
      di.name            AS disease_name
    FROM Appointment a
    JOIN Doctor   d  ON a.doctor_id   = d.doctor_id
    JOIN Hospital h  ON a.hospital_id = h.hospital_id
    JOIN Disease  di ON a.disease_id  = di.disease_id
    WHERE a.patient_id = ?
    ORDER BY a.appointment_date DESC
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

/*
 * PUT /api/appointments/:id/cancel
 * Used on: My Appointments page (cancel button)
 *
 * WHY: Patients can only cancel Booked appointments.
 *      Completed ones cannot be undone.
 *      patient_id check ensures they cancel only their own.
 *
 * HOW: UPDATE with 3 conditions in WHERE.
 *      affectedRows === 0 means nothing changed
 *      (wrong patient or already completed).
 */
const cancelAppointment = (req, res) => {
  const { id }        = req.params;
  const { patient_id } = req.body;

  db.query(
    `UPDATE Appointment
     SET    status = 'Cancelled'
     WHERE  appointment_id = ?
     AND    patient_id     = ?
     AND    status        != 'Completed'`,
    [id, patient_id],
    (err, result) => {
      if (err)                    return res.status(500).json({ message: 'Server error' });
      if (!result.affectedRows)   return res.status(400).json({ message: 'Cannot cancel' });
      res.json({ message: 'Appointment cancelled' });
    }
  );
};

module.exports = { bookAppointment, getPatientAppointments, cancelAppointment };