const db = require('../db');

const getLatestMedications = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT
      m.trade_name, m.form, m.strength_value, m.strength_unit,
      g.generic_name, pd.dosage, pd.duration_days, pd.instructions
    FROM Prescription pr
    JOIN PrescriptionDetails pd ON pr.prescription_id = pd.prescription_id
    JOIN Medicine            m  ON pd.medicine_id     = m.medicine_id
    JOIN Generic             g  ON m.generic_id       = g.generic_id
    JOIN Appointment         a  ON pr.appointment_id  = a.appointment_id
    WHERE a.patient_id = ?
    AND pr.created_at = (
      SELECT MAX(pr2.created_at)
      FROM Prescription pr2
      JOIN Appointment  a2 ON pr2.appointment_id = a2.appointment_id
      WHERE a2.patient_id = ?
    )
  `;

  db.query(query, [id, id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

const getPatientPrescriptions = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT
      pr.prescription_id, pr.diagnosis_notes, pr.created_at,
      d.full_name  AS doctor_name,
      h.name       AS hospital_name,
      di.name      AS disease_name,
      m.medicine_id, m.trade_name, m.form, m.strength_value, m.strength_unit,
      g.generic_id, g.generic_name,
      pd.dosage, pd.duration_days, pd.instructions
    FROM Prescription pr
    JOIN PrescriptionDetails pd ON pr.prescription_id = pd.prescription_id
    JOIN Medicine            m  ON pd.medicine_id     = m.medicine_id
    JOIN Generic             g  ON m.generic_id       = g.generic_id
    JOIN Appointment         a  ON pr.appointment_id  = a.appointment_id
    JOIN Doctor              d  ON a.doctor_id        = d.doctor_id
    JOIN Hospital            h  ON a.hospital_id      = h.hospital_id
    JOIN Disease             di ON a.disease_id       = di.disease_id
    WHERE a.patient_id = ?
    ORDER BY pr.created_at DESC
  `;

  db.query(query, [id], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    // Group rows by prescription_id — one object per prescription, medicines as array
    const grouped = {};

    rows.forEach(row => {
      if (!grouped[row.prescription_id]) {
        grouped[row.prescription_id] = {
          prescription_id: row.prescription_id,
          diagnosis_notes: row.diagnosis_notes,
          created_at:      row.created_at,
          doctor_name:     row.doctor_name,
          hospital_name:   row.hospital_name,
          disease_name:    row.disease_name,
          medicines:       [],
        };
      }

      grouped[row.prescription_id].medicines.push({
        medicine_id:    row.medicine_id,
        trade_name:     row.trade_name,
        form:           row.form,
        strength_value: row.strength_value,
        strength_unit:  row.strength_unit,
        generic_id:     row.generic_id,
        generic_name:   row.generic_name,
        dosage:         row.dosage,
        duration_days:  row.duration_days,
        instructions:   row.instructions,
      });
    });

    res.json(Object.values(grouped));
  });
};

const getPatientSummary = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT
      p.full_name, p.blood_group, p.gender, p.phone, p.address,
      p.weight, p.height, p.date_of_birth, p.emergency_contact,
      COUNT(DISTINCT a.appointment_id) AS total_appointments,
      COUNT(DISTINCT mh.history_id)    AS total_records,
      COUNT(DISTINCT a.disease_id)     AS unique_diseases
    FROM Patient p
    LEFT JOIN Appointment    a  ON p.patient_id = a.patient_id
    LEFT JOIN MedicalHistory mh ON p.patient_id = mh.patient_id
    WHERE p.patient_id = ?
    GROUP BY p.patient_id
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results[0]);
  });
};

module.exports = { getLatestMedications, getPatientPrescriptions, getPatientSummary };