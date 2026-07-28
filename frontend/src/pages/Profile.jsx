import { useEffect, useState } from 'react';
import Page from '../components/Page';
import { getPatientSummary } from '../services';

export default function Profile() {
  const patient = JSON.parse(localStorage.getItem('patient') || '{}');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getPatientSummary(patient.patient_id).then(r => setSummary(r.data)).catch(() => {});
  }, []);

  const fields = [
    { label: 'Blood Group',       value: patient.blood_group                         },
    { label: 'Gender',            value: patient.gender                              },
    { label: 'Date of Birth',     value: patient.date_of_birth?.split('T')[0]        },
    { label: 'Phone',             value: patient.phone                               },
    { label: 'Address',           value: patient.address                             },
    { label: 'Weight',            value: patient.weight ? `${patient.weight} kg` : null },
    { label: 'Height',            value: patient.height ? `${patient.height} cm` : null },
    { label: 'Emergency Contact', value: patient.emergency_contact                   },
  ];

  return (
    <Page title="My Profile">
      {/* Name banner */}
      <div className="card p-6 mb-6 bg-green-700 text-white">
        <p className="text-2xl font-bold">{patient.full_name}</p>
        <p className="text-green-200 text-sm mt-1">Patient ID: {patient.patient_id}</p>
      </div>

      {/* Info grid */}
      <div className="card p-6 mb-6">
        <div className="grid grid-cols-2 gap-5">
          {fields.map((f, i) => (
            <div key={i}>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                {f.label}
              </p>
              <p className="text-gray-800 font-medium mt-0.5">{f.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      {summary && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Appointments', value: summary.total_appointments },
            { label: 'Medical Records',    value: summary.total_records      },
            { label: 'Unique Diseases',    value: summary.unique_diseases    },
          ].map((s, i) => (
            <div key={i} className="card p-5 text-center">
              <p className="text-3xl font-bold text-green-600">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1 font-medium uppercase tracking-wide">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}