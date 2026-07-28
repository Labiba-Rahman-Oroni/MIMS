import { useEffect, useState } from 'react';
import Page from '../components/Page';
import { getAllDiseases, suggestDoctors, getDoctorHospitals, bookAppointment } from '../services';

// Reusable select dropdown used multiple times on this page
function Select({ label, value, onChange, options, valueKey, labelFn, placeholder }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100">
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o[valueKey]} value={o[valueKey]}>{labelFn(o)}</option>
        ))}
      </select>
    </div>
  );
}

export default function BookAppointment() {
  const patient = JSON.parse(localStorage.getItem('patient') || '{}');
  const [diseases,  setDiseases]  = useState([]);
  const [doctors,   setDoctors]   = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [form, setForm] = useState({
    disease_id: '', doctor_id: '', hospital_id: '',
    appointment_date: '', appointment_time: ''
  });
  const [msg,     setMsg]     = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllDiseases().then(r => setDiseases(r.data));
  }, []);

  // Step 1 — disease selected → load suggested doctors
  const onDiseaseChange = (id) => {
    setForm({ ...form, disease_id: id, doctor_id: '', hospital_id: '' });
    setDoctors([]); setHospitals([]);
    if (id) suggestDoctors(id).then(r => setDoctors(r.data));
  };

  // Step 2 — doctor selected → load their hospitals
  const onDoctorChange = (id) => {
    setForm({ ...form, doctor_id: id, hospital_id: '' });
    setHospitals([]);
    if (id) getDoctorHospitals(id).then(r => setHospitals(r.data));
  };

  // Step 3 — confirm booking
  const handleBook = async () => {
    setLoading(true); setMsg('');
    try {
      const res = await bookAppointment({ ...form, patient_id: patient.patient_id });
      setMsg(`Booked! Your token is #${res.data.token}`);
      setForm({ disease_id: '', doctor_id: '', hospital_id: '', appointment_date: '', appointment_time: '' });
      setDoctors([]); setHospitals([]);
    } catch {
      setMsg('Booking failed. Please try again.');
    }
    setLoading(false);
  };

  const isReady = form.disease_id && form.doctor_id && form.hospital_id
               && form.appointment_date && form.appointment_time;

  return (
    <Page title="Book Appointment">
      <div className="card p-6 max-w-xl space-y-5">

        <Select label="Disease" value={form.disease_id} onChange={onDiseaseChange}
          options={diseases} valueKey="disease_id" labelFn={d => d.name}
          placeholder="— Select your disease —" />

        {doctors.length > 0 && (
          <Select label="Suggested Doctors" value={form.doctor_id} onChange={onDoctorChange}
            options={doctors} valueKey="doctor_id"
            labelFn={d => `${d.full_name} · ${d.experience_years} yrs · ৳${d.consultation_fee}`}
            placeholder="— Select a doctor —" />
        )}

        {hospitals.length > 0 && (
          <Select label="Hospital" value={form.hospital_id}
            onChange={id => setForm({ ...form, hospital_id: id })}
            options={hospitals} valueKey="hospital_id"
            labelFn={h => `${h.name} · ${h.day_of_week} (${h.shift_type})`}
            placeholder="— Select hospital —" />
        )}

        {form.hospital_id && (
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Date', type: 'date', key: 'appointment_date' },
              { label: 'Time', type: 'time', key: 'appointment_time' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {f.label}
                </label>
                <input type={f.type} value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>
            ))}
          </div>
        )}

        {isReady && (
          <button onClick={handleBook} disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50">
            {loading ? 'Booking...' : 'Confirm Appointment'}
          </button>
        )}

        {msg && (
          <div className={`p-4 rounded-xl text-sm font-medium ${
            msg.includes('failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
          }`}>
            {msg}
          </div>
        )}
      </div>
    </Page>
  );
}