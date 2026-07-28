import { useEffect, useState } from 'react';
import Page from '../components/Page';
import { getAllDoctors, getAllSpecializations, getDoctorSchedule } from '../services';

export default function Doctors() {
  const [doctors,         setDoctors]         = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filter,          setFilter]          = useState('');
  const [schedules,       setSchedules]       = useState({});

  useEffect(() => {
    getAllDoctors().then(r => setDoctors(r.data));
    getAllSpecializations().then(r => setSpecializations(r.data));
  }, []);

  const handleFilter = (name) => {
    setFilter(name);
    getAllDoctors(name || undefined).then(r => setDoctors(r.data));
  };

  const toggleSchedule = (id) => {
    if (schedules[id]) {
      setSchedules(p => ({ ...p, [id]: null }));
      return;
    }
    getDoctorSchedule(id).then(r => setSchedules(p => ({ ...p, [id]: r.data })));
  };

  return (
    <Page title="Doctors">
      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['', ...specializations.map(s => s.name)].map(name => (
          <button key={name} onClick={() => handleFilter(name)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filter === name
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
            }`}>
            {name || 'All'}
          </button>
        ))}
      </div>

      {/* Doctor cards */}
      <div className="space-y-4">
        {doctors.map(d => (
          <div key={d.doctor_id} className="card p-6 lift">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-900 text-lg">{d.full_name}</p>
                <p className="text-green-600 text-sm font-medium">{d.specializations}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {d.experience_years} yrs &nbsp;·&nbsp; ৳{d.consultation_fee} fee
                  &nbsp;·&nbsp; {d.total_patients} patients
                </p>
              </div>
              <button onClick={() => toggleSchedule(d.doctor_id)}
                className="text-sm text-green-600 font-medium hover:text-green-800">
                {schedules[d.doctor_id] ? 'Hide ▲' : 'Schedule ▼'}
              </button>
            </div>

            {schedules[d.doctor_id] && (
              <div className="mt-4 bg-green-50 rounded-xl p-4 space-y-2">
                {schedules[d.doctor_id].map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                    <span className="font-medium">{s.hospital_name}</span>
                    <span className="text-gray-400">
                      — {s.day_of_week} · {s.start_time?.slice(0,5)}–{s.end_time?.slice(0,5)}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      {s.shift_type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Page>
  );
}