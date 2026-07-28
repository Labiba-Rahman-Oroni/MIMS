const db = require('../db');

/*
 * GET /api/medicines?search=Napa&strength=500
 * Used on: Medicines page — live search
 *
 * WHY: Users search by trade name (Napa) OR generic name (Paracetamol).
 *      Old version only searched generic_name so typing 'Napa' gave no results.
 *
 * WHAT IT DOES:
 *   Searches both trade_name AND generic_name using OR.
 *   Optionally also filters by exact strength value.
 *
 * HOW IT WORKS:
 *   WHERE 1=1 → always true, lets us add AND conditions safely.
 *
 *   AND (m.trade_name LIKE ? OR g.generic_name LIKE ?)
 *   → matches if EITHER the trade name OR generic name contains the search text.
 *   Both use the same search value wrapped in % wildcards.
 *   % means "anything before or after" so 'napa' matches 'Napa Extra' too.
 *
 *   AND m.strength_value = ? → optional exact strength filter.
 *   Only added if strength param is provided.
 *
 *   LIKE is case-insensitive in MySQL by default
 *   so 'napa', 'Napa', 'NAPA' all work.
 */
const getAllMedicines = (req, res) => {
  // Frontend sends ?search=Napa&strength=500
  const { search, strength } = req.query;

  let query = `
    SELECT
      m.medicine_id,
      m.trade_name,
      m.form,
      m.strength_value,
      m.strength_unit,
      m.manufacturer,
      g.generic_name
    FROM Medicine m
    JOIN Generic g ON m.generic_id = g.generic_id
    WHERE 1=1
  `;

  const params = [];

  // Search both trade_name AND generic_name
  if (search && search.trim()) {
    query += ` AND (m.trade_name LIKE ? OR g.generic_name LIKE ?)`;
    params.push(`%${search.trim()}%`);  // for trade_name
    params.push(`%${search.trim()}%`);  // for generic_name
  }

  // Filter by exact strength if provided
  if (strength && strength.trim()) {
    query += ` AND m.strength_value = ?`;
    params.push(strength.trim());
  }

  query += ` ORDER BY g.generic_name, m.trade_name`;

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });
    res.json(results);
  });
};

/*
 * GET /api/medicines/alternatives/:medicine_id
 * Used on: Medicines page — Show Substitutes button
 *
 * WHY: Same generic compound + same strength = can substitute each other.
 *      Helps patients find cheaper or available alternatives.
 *
 * WHAT IT DOES:
 *   Given one medicine_id, returns all OTHER medicines
 *   that share the exact same generic compound AND same strength.
 *
 * HOW IT WORKS:
 *   Subquery 1: finds the generic_id of the given medicine
 *   Subquery 2: finds the strength_value of the given medicine
 *   Main query: finds medicines matching both, excluding the original
 *
 *   Example — substitutes of Napa (medicine_id=1):
 *   Subquery 1 → generic_id = 1 (Paracetamol)
 *   Subquery 2 → strength_value = 500
 *   Main query → Ace (500mg Paracetamol), Paracet (500mg Paracetamol)
 *   Napa Extra excluded because strength = 665, not 500
 */
const getSubstitutes = (req, res) => {
  const { medicine_id } = req.params;

  const query = `
    SELECT
      m.medicine_id,
      m.trade_name,
      m.form,
      m.strength_value,
      m.strength_unit,
      m.manufacturer,
      g.generic_name
    FROM Medicine m
    JOIN Generic g ON m.generic_id = g.generic_id
    WHERE m.generic_id = (
      SELECT generic_id FROM Medicine WHERE medicine_id = ?
    )
    AND m.strength_value = (
      SELECT strength_value FROM Medicine WHERE medicine_id = ?
    )
    AND m.medicine_id != ?
  `;

  db.query(query, [medicine_id, medicine_id, medicine_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });
    res.json(results);
  });
};

module.exports = { getAllMedicines, getSubstitutes };