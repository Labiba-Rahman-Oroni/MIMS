import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5001/api' });

export const loginAPI             = (phone)          => API.post('/auth/login', { phone });
export const getPatientSummary    = (id)             => API.get(`/patients/${id}/summary`);
export const getLatestMeds        = (id)             => API.get(`/patients/${id}/medications`);
export const getMyPrescriptions   = (id)             => API.get(`/patients/${id}/prescriptions`);
export const getAllDoctors         = (spec)           => API.get('/doctors', { params: { specialization: spec } });
export const getDoctorSchedule    = (id)             => API.get(`/doctors/${id}/schedule`);
export const getDoctorHospitals   = (id)             => API.get(`/doctors/${id}/hospitals`);
export const suggestDoctors       = (did)            => API.get(`/doctors/suggest/${did}`);
export const getMyAppointments    = (id)             => API.get(`/appointments/patient/${id}`);
export const bookAppointment      = (data)           => API.post('/appointments/book', data);
export const cancelAppointment    = (id, patient_id) => API.put(`/appointments/${id}/cancel`, { patient_id });

// Medicine search — uses 'search' param now (searches both trade + generic name)
export const getAllMedicines = (search, strength) => {
  const params = {};
  if (search?.trim())   params.search   = search.trim();
  if (strength?.trim()) params.strength = strength.trim();
  return API.get('/medicines', { params });
};

export const getSubstitutes       = (id)             => API.get(`/medicines/alternatives/${id}`);
export const getAllDiseases        = ()               => API.get('/diseases');
export const getAllSpecializations = ()               => API.get('/specializations');
export const getMedicalHistory    = (id)             => API.get(`/medical-history/${id}`);