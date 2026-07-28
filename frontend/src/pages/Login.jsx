import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAPI } from '../services';

export default function Login() {
  const navigate = useNavigate();
  const [phone,   setPhone]   = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim()) { setError('Enter your phone number'); return; }
    setLoading(true); setError('');
    try {
      const res = await loginAPI(phone.trim());
      localStorage.setItem('patient', JSON.stringify(res.data.patient));
      navigate('/');
    } catch {
      setError('No patient found with this phone number.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-green-700 flex items-center justify-center px-4">
      <div className="card p-10 w-full max-w-sm">
        <h1 className="text-4xl text-green-700 mb-1 flex items-center justify-center"
          style={{ fontFamily: 'DM Serif Display, serif'  }}>
          MIMS
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Medical Information Management System
        </p>

        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Phone Number
        </label>
        <input
          type="text"
          placeholder="01711000001"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 mb-3"
        />
        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <button onClick={handleLogin} disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center text-xs text-gray-300 mt-5">
          Demo: <span className="text-green-600 font-semibold">01711000001</span>
        </p>
      </div>
    </div>
  );
}