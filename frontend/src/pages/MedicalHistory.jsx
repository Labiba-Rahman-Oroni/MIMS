import { useEffect, useState } from 'react';
import Page from '../components/Page';
import { getMedicalHistory } from '../services';

export default function MedicalHistory() {
  const patient = JSON.parse(localStorage.getItem('patient') || '{}');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getMedicalHistory(patient.patient_id).then(r => setHistory(r.data));
  }, []);

  return (
    <Page title="Medical History">
      {history.length === 0 ? (
        <p className="text-gray-400">No history found.</p>
      ) : (
        <div className="space-y-4">
          {history.map((h, i) => (
            <div key={i} className="card p-6 lift">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-green-700">
                    {h.disease_name}
                    <span className="ml-2 text-xs text-gray-400 font-normal">({h.icd_code})</span>
                  </p>
                  <p className="text-sm text-gray-500">{h.specialization}</p>
                </div>
                <p className="text-xs text-gray-400">{h.recorded_at?.split('T')[0]}</p>
              </div>
              <p className="text-sm text-gray-500 mb-1">
                Dr. {h.doctor_name} &nbsp;·&nbsp; {h.hospital_name}
              </p>
              <p className="text-sm text-gray-400 italic mb-4">{h.diagnosis_notes}</p>
              <div className="border-l-4 border-green-300 pl-4">
                <p className="font-semibold text-gray-800 text-sm">
                  {h.medicine_name}
                  <span className="ml-2 text-gray-400 font-normal text-xs">
                    {h.strength_value}{h.strength_unit} · {h.form}
                  </span>
                </p>
                <p className="text-xs text-green-600">Generic: {h.generic_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {h.dosage} — {h.duration_days} days
                </p>
                <p className="text-xs text-gray-400 italic">{h.instructions}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}