import { useState } from 'react';
import { getSubstitutes } from '../services';

export default function MedicineCard({ medicine }) {
  const [subs,    setSubs]    = useState(null);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    if (subs !== null) { setSubs(null); return; }
    setLoading(true);
    try {
      const res = await getSubstitutes(medicine.medicine_id);
      setSubs(res.data);
    } catch { setSubs([]); }
    setLoading(false);
  };

  return (
    <div className="border-l-4 border-green-400 pl-4 mb-5">
      <p className="font-semibold text-gray-800 text-sm">
        {medicine.trade_name}
        <span className="ml-2 text-gray-400 font-normal text-xs">
          {medicine.strength_value}{medicine.strength_unit} · {medicine.form}
        </span>
      </p>
      <p className="text-xs text-green-600 mt-0.5">Generic: {medicine.generic_name}</p>
      <p className="text-xs text-gray-500 mt-0.5">
        {medicine.dosage} — {medicine.duration_days} days
      </p>
      <p className="text-xs text-gray-400 italic mt-0.5">{medicine.instructions}</p>

      <button onClick={toggle}
        className="text-xs text-green-600 hover:text-green-800 mt-1 font-medium">
        {loading ? 'Loading...' : subs !== null ? 'Hide substitutes ▲' : 'Show substitutes ▼'}
      </button>

      {subs !== null && (
        <div className="mt-2 bg-green-50 rounded-xl p-3">
          <p className="text-xs font-semibold text-gray-500 mb-1">
            Same generic + strength:
          </p>
          {subs.length === 0
            ? <p className="text-xs text-gray-400">No substitutes found</p>
            : subs.map((s, i) => (
              <p key={i} className="text-xs text-gray-700 py-0.5">
                ✓ <span className="font-semibold">{s.trade_name}</span>
                <span className="text-gray-400 ml-1">— {s.manufacturer}</span>
              </p>
            ))
          }
        </div>
      )}
    </div>
  );
}