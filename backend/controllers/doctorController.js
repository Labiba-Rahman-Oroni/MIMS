const db = require('../db');

/*
 * GET /api/doctors?specialization=Cardiology
 * Used on: Doctors page
 *
 * WHY: One doctor can have multiple specializations stored
 *      as separate rows. We need one row per doctor.
 *      Users can also filter by specialization.
 *
 * HOW: GROUP_CONCAT merges multiple specializations per doctor.
 *      WHERE s.name LIKE ? with '%' as default = no filter.
 *      LEFT JOIN Appointment counts how many patients seen.
 */
const getAllDoctors = (req, res) => {
  const { specialization } = req.query;
  const filter = specialization || '%';

  const query = `
    SELECT
      d.doctor_id,
      d.full_name,
      d.experience_years,
      d.consultation_fee,
      GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ') AS specializations,
      COUNT(DISTINCT a.appointment_id)             AS total_patients
    FROM Doctor d
    JOIN DoctorSpecialization ds ON d.doctor_id          = ds.doctor_id
    JOIN Specialization       s  ON ds.specialization_id = s.specialization_id
    LEFT JOIN Appointment     a  ON d.doctor_id          = a.doctor_id
    WHERE s.name LIKE ?
    GROUP BY d.doctor_id
    ORDER BY d.experience_years DESC
  `;

  db.query(query, [filter], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

/*
 * GET /api/doctors/suggest/:disease_id
 * Used on: Book Appointment page (after selecting disease)
 *
 * WHY: Automatically suggests doctors based on disease.
 *      Disease links to a specialization.
 *      Doctors with that specialization are the right ones.
 *
 * HOW: Disease → Specialization → DoctorSpecialization → Doctor
 *      All connected via JOINs following that chain.
 */
const suggestDoctors = (req, res) => {
  const { disease_id } = req.params;

  const query = `
    SELECT
      d.doctor_id,
      d.full_name,
      d.experience_years,
      d.consultation_fee,
      s.name AS specialization
    FROM Doctor d
    JOIN DoctorSpecialization ds ON d.doctor_id          = ds.doctor_id
    JOIN Specialization       s  ON ds.specialization_id = s.specialization_id
    JOIN Disease              di ON di.specialization_id = s.specialization_id
    WHERE di.disease_id = ?
    ORDER BY d.experience_years DESC
  `;

  db.query(query, [disease_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

/*
 * GET /api/doctors/:id/schedule
 * Used on: Doctors page (schedule dropdown per doctor)
 *
 * WHY: Shows which hospital, day and time a doctor works.
 *      Days need to appear Mon→Sun not alphabetically.
 *
 * HOW: JOIN Hospital for hospital name.
 *      FIELD() sets custom day ordering Mon→Sun.
 */
const getDoctorSchedule = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT
      ds.day_of_week,
      ds.start_time,
      ds.end_time,
      ds.shift_type,
      h.name    AS hospital_name,
      h.address AS hospital_address
    FROM DoctorSchedule ds
    JOIN Hospital h ON ds.hospital_id = h.hospital_id
    WHERE ds.doctor_id = ?
    ORDER BY FIELD(ds.day_of_week,
      'Monday','Tuesday','Wednesday',
      'Thursday','Friday','Saturday','Sunday')
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

/*
 * GET /api/doctors/:id/hospitals
 * Used on: Book Appointment page (hospital selection step)
 *
 * WHY: After picking a doctor, patient picks which hospital
 *      and which day/shift to visit them.
 *
 * HOW: DoctorSchedule links doctors to hospitals with timing.
 *      JOIN Hospital gets the hospital name and address.
 */
const getDoctorHospitals = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT
      h.hospital_id,
      h.name,
      h.address,
      h.hospital_type,
      ds.day_of_week,
      ds.start_time,
      ds.end_time,
      ds.shift_type
    FROM Hospital h
    JOIN DoctorSchedule ds ON h.hospital_id = ds.hospital_id
    WHERE ds.doctor_id = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

module.exports = {
  getAllDoctors,
  suggestDoctors,
  getDoctorSchedule,
  getDoctorHospitals,
};