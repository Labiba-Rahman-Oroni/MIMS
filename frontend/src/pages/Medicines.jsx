import { useEffect, useState, useRef } from 'react';
import Page from '../components/Page';
import MedicineCard from '../components/MedicineCard';
import { getAllMedicines } from '../services';

export default function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [search,    setSearch]    = useState('');
  const [strength,  setStrength]  = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  // useRef stores the debounce timer between renders
  // without causing a re-render when it changes (unlike useState)
  const timer = useRef(null);

  /*
   * LIVE SEARCH — how it works:
   *
   * Every time 'search' or 'strength' changes (user types),
   * this useEffect runs.
   *
   * It first clears any previous timer that was waiting.
   * Then starts a new 400ms timer.
   * If user types again within 400ms → old timer is cleared, new one starts.
   * Only when user STOPS typing for 400ms → fetchMedicines actually runs.
   *
   * This is called DEBOUNCING — prevents a request on every single keystroke.
   *
   * FIX for stale closure bug:
   * Both search AND strength are in the dependency array [search, strength].
   * So when either changes, useEffect re-runs and has the LATEST values
   * of both variables. No more stale data.
   */
  useEffect(() => {
    // Clear the previous timer
    clearTimeout(timer.current);

    // Start a new timer — runs fetchMedicines after 400ms of no typing
    timer.current = setTimeout(() => {
      fetchMedicines(search, strength);
    }, 400);

    // Cleanup — clear timer if component unmounts
    return () => clearTimeout(timer.current);
  }, [search, strength]); // re-runs when EITHER changes — fixes stale closure

  const fetchMedicines = async (searchVal, strengthVal) => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllMedicines(searchVal, strengthVal);
      setMedicines(res.data);
    } catch {
      setError('Failed to load medicines. Is the backend running?');
      setMedicines([]);
    }
    setLoading(false);
  };

  const handleClear = () => {
    setSearch('');
    setStrength('');
    // useEffect will fire automatically and fetch all medicines
  };

  return (
    <Page title="Medicines">

      {/* Search inputs */}
      <div className="flex gap-3 mb-4">

        {/* Main search — searches BOTH trade name and generic name */}
        <div className="flex-1 relative">
          <input
            placeholder="Search trade name or generic (e.g. Napa, Paracetamol)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-28 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
          {/* Inline status */}
          <span className="absolute right-4 top-3.5 text-xs text-gray-400">
            {loading ? 'Searching...' : `${medicines.length} found`}
          </span>
        </div>

        {/* Strength filter */}
        <input
          placeholder="Strength (e.g. 500)"
          value={strength}
          onChange={e => setStrength(e.target.value)}
          className="w-40 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
        />

        {/* Clear button — only shows when something is typed */}
        {(search || strength) && (
          <button onClick={handleClear}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-3 rounded-xl font-semibold text-sm transition-all">
            Clear
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-4">
          {error}
        </div>
      )}

      {/* Search hint */}
      {!search && !strength && (
        <p className="text-xs text-gray-400 mb-4">
          Type a medicine or generic name above to search. Results update as you type.
        </p>
      )}

      {/* Medicine list */}
      <div className="card p-6">
        {loading ? (
          <p className="text-sm text-gray-400">Searching...</p>
        ) : medicines.length === 0 ? (
          <p className="text-sm text-gray-400">
            {search || strength ? 'No medicines found. Try a different search.' : 'No medicines found.'}
          </p>
        ) : (
          medicines.map((m, i) => (
            <MedicineCard key={m.medicine_id || i} medicine={m} />
          ))
        )}
      </div>
    </Page>
  );
}