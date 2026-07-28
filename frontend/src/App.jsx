import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Doctors       from './pages/Doctors';
import BookAppoint   from './pages/BookAppointment';
import Appointments  from './pages/Appointments';
import Prescriptions from './pages/Prescriptions';
import History       from './pages/MedicalHistory';
import Medicines     from './pages/Medicines';
import Profile       from './pages/Profile';

function Guard({ children }) {
  return localStorage.getItem('patient') ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login"         element={<Login />} />
        <Route path="/"              element={<Guard><Dashboard /></Guard>} />
        <Route path="/profile"       element={<Guard><Profile /></Guard>} />
        <Route path="/doctors"       element={<Guard><Doctors /></Guard>} />
        <Route path="/book"          element={<Guard><BookAppoint /></Guard>} />
        <Route path="/appointments"  element={<Guard><Appointments /></Guard>} />
        <Route path="/prescriptions" element={<Guard><Prescriptions /></Guard>} />
        <Route path="/history"       element={<Guard><History /></Guard>} />
        <Route path="/medicines"     element={<Guard><Medicines /></Guard>} />
      </Routes>
    </Router>
  );
}