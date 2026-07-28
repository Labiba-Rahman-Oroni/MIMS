import { useEffect, useState } from 'react';
import Page from '../components/Page';
import MedicineCard from '../components/MedicineCard';
import { getMyPrescriptions } from '../services';

export default function Prescriptions() {
  const patient = JSON.parse(localStorage.getItem('patient') || '{}');
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    // Backend returns grouped array — each item has medicines[] inside
    getMyPrescriptions(patient.patient_id).then(r => setPrescriptions(r.data));
  }, []);

  return (
    <Page title="My Prescriptions">
      {prescriptions.length === 0 ? (
        <p className="text-gray-400">No prescriptions found.</p>
      ) : (
        <div className="space-y-5">
          {prescriptions.map(pr => (
            <div key={pr.prescription_id} className="card p-6 border-l-4 border-green-400">
              {/* Header */}
              <div className="mb-4 pb-3 border-b border-gray-100">
                <p className="font-bold text-green-700 text-lg">{pr.disease_name}</p>
                <p className="text-sm text-gray-500">
                  Dr. {pr.doctor_name} &nbsp;·&nbsp; {pr.hospital_name}
                </p>
                <p className="text-sm text-gray-400 italic mt-1">{pr.diagnosis_notes}</p>
                <p className="text-xs text-gray-300 mt-1">{pr.created_at?.split('T')[0]}</p>
              </div>

              {/* Medicines — already grouped as array from backend */}
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Medicines ({pr.medicines.length})
              </p>
              {pr.medicines.map((m, i) => (
                <MedicineCard key={i} medicine={m} />
              ))}
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}