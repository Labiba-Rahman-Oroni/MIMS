import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../components/Page';
import { getPatientSummary, getLatestMeds } from '../services';

const cards = [
  { label: 'My Profile',    path: '/profile',       bg: 'bg-green-600'   },
  { label: 'Doctors',       path: '/doctors',       bg: 'bg-teal-600'    },
  { label: 'Book',          path: '/book',          bg: 'bg-emerald-600' },
  { label: 'Appointments',  path: '/appointments',  bg: 'bg-green-700'   },
  { label: 'Prescriptions', path: '/prescriptions', bg: 'bg-teal-700'    },
  { label: 'History',       path: '/history',       bg: 'bg-emerald-700' },
  { label: 'Medicines',     path: '/medicines',     bg: 'bg-green-800'   },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const patient  = JSON.parse(localStorage.getItem('patient') || '{}');
  const [summary, setSummary] = useState(null);
  const [meds,    setMeds]    = useState([]);

  useEffect(() => {
    getPatientSummary(patient.patient_id).then(r => setSummary(r.data)).catch(() => {});
    getLatestMeds(patient.patient_id).then(r => setMeds(r.data)).catch(() => {});
  }, []);

  return (
    <Page>
      <div className="mb-8">
        <h2 className="text-3xl text-[#202940]" style={{ fontFamily: 'DM Serif Display, serif' }}>
          Welcome back, {patient?.full_name?.split(' ')[0]}
        </h2>
        <p className="text-gray-400 text-sm mt-1">Here is your health overview</p>
      </div>

      {/* Stats */}
      {summary && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Appointments', value: summary.total_appointments },
            { label: 'Records',      value: summary.total_records      },
            { label: 'Diseases',     value: summary.unique_diseases    },
          ].map((s, i) => (
            <div key={i} className="card p-5 text-center">
              <p className="text-3xl font-bold text-green-600">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Current medications */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Current Medications</h3>
        {meds.length === 0 ? (
          <p className="text-gray-400 text-sm">No active medications</p>
        ) : (
          <div className="space-y-3">
            {meds.map((m, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {m.trade_name}
                    <span className="ml-2 font-normal text-gray-400 text-xs">
                      {m.strength_value}{m.strength_unit} · {m.form}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">{m.dosage}</p>
                  <p className="text-xs text-gray-400 italic">{m.instructions}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nav cards */}
      <div className="grid grid-cols-4 gap-3">
        {cards.map((c, i) => (
          <button
            key={i}
            onClick={() => navigate(c.path)}
            className={`lift ${c.bg} text-white rounded-2xl p-5 text-left`}
          >
            <p className="font-semibold text-sm">{c.label}</p>
          </button>
        ))}
      </div>
    </Page>
  );
}