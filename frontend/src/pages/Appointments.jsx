import { useEffect, useState } from 'react';
import Page from '../components/Page';
import { getMyAppointments, cancelAppointment } from '../services';

const statusStyle = {
  Booked:    'bg-blue-50 text-blue-600',
  Completed: 'bg-green-50 text-green-600',
  Cancelled: 'bg-red-50 text-red-500',
};

export default function Appointments() {
  const patient = JSON.parse(localStorage.getItem('patient') || '{}');
  const [appointments, setAppointments] = useState([]);

  const load = () => {
    getMyAppointments(patient.patient_id).then(r => setAppointments(r.data));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await cancelAppointment(id, patient.patient_id);
      load();
    } catch {
      alert('Cannot cancel this appointment.');
    }
  };

  return (
    <Page title="My Appointments">
      {appointments.length === 0 ? (
        <p className="text-gray-400">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map(a => (
            <div key={a.appointment_id} className="card p-6 lift">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900">{a.doctor_name}</p>
                  <p className="text-sm text-green-600">{a.disease_name}</p>
                  <p className="text-sm text-gray-400 mt-1">{a.hospital_name}</p>
                  <p className="text-sm text-gray-400">
                    {a.appointment_date?.split('T')[0]} at {a.appointment_time?.slice(0,5)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Token <span className="font-bold text-green-600">#{a.token_number}</span>
                    &nbsp;·&nbsp; ৳{a.consultation_fee}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusStyle[a.status]}`}>
                    {a.status}
                  </span>
                  {a.status === 'Booked' && (
                    <button onClick={() => handleCancel(a.appointment_id)}
                      className="text-xs text-red-400 hover:text-red-600 font-medium">
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}