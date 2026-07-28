import { NavLink, useNavigate } from 'react-router-dom';

const links = [
  { to: '/',              label: 'Dashboard'     },
  { to: '/doctors',       label: 'Doctors'       },
  { to: '/book',          label: 'Book'          },
  { to: '/appointments',  label: 'Appointments'  },
  { to: '/prescriptions', label: 'Prescriptions' },
  { to: '/medicines',     label: 'Medicines'     },
  { to: '/history',       label: 'History'       },
  { to: '/profile',       label: 'Profile'       },
];

export default function Navbar() {
  const navigate = useNavigate();
  const patient  = JSON.parse(localStorage.getItem('patient') || '{}');

  const logout = () => {
    localStorage.removeItem('patient');
    navigate('/login');
  };

  return (
    <nav className="bg-green-700 text-white px-6 py-3 flex items-center justify-between shadow-lg sticky top-0 z-50">
      <span className="text-xl font-bold"
        style={{ fontFamily: 'DM Serif Display, serif' }}>
        MIMS
      </span>

      <div className="flex gap-1 text-sm">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-white text-green-700'
                  : 'text-green-100 hover:bg-green-600'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-3 text-sm">
        <span className="text-green-200 font-medium">{patient?.full_name}</span>
        <button onClick={logout}
          className="bg-green-800 hover:bg-green-900 px-3 py-1.5 rounded-lg transition-all font-medium">
          Logout
        </button>
      </div>
    </nav>
  );
}