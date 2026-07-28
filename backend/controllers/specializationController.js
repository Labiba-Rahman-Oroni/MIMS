const db = require('../db');

/*
 * GET /api/specializations
 * Used on: Doctors page (filter buttons at the top)
 *
 * WHY: Filter buttons are loaded dynamically from the DB.
 *      This way adding a new specialization to the DB
 *      automatically adds a new filter button on the page.
 *
 * HOW: Simple SELECT — no JOINs needed.
 *      Returns every row from the Specialization table.
 */
const getAllSpecializations = (req, res) => {
  db.query('SELECT * FROM Specialization', (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

module.exports = { getAllSpecializations };