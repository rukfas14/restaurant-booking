import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setSession, getToken } from '../lib/api.js';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@demo.ba');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (getToken()) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user, restaurant } = await api.login(email, password);
      setSession(token, user, restaurant);
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err.message === 'invalid_credentials'
          ? 'Pogrešan email ili lozinka.'
          : 'Greška pri prijavi. Pokušajte ponovo.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm border border-warm-200"
      >
        <h1 className="text-2xl font-bold text-warm-900 mb-1">
          Prijava
        </h1>
        <p className="text-sm text-warm-900/70 mb-6">
          Booking dashboard za restoran
        </p>

        <label className="block text-xs font-semibold text-warm-900/70 uppercase mb-1">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-warm-300 rounded-lg focus:outline-none focus:border-warm-500 focus:ring-2 focus:ring-warm-500/20"
        />

        <label className="block text-xs font-semibold text-warm-900/70 uppercase mb-1">
          Lozinka
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-warm-300 rounded-lg focus:outline-none focus:border-warm-500 focus:ring-2 focus:ring-warm-500/20"
        />

        {error && (
          <div className="text-sm text-warm-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-warm-500 to-warm-600 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition"
        >
          {loading ? 'Prijava…' : 'Prijavi se'}
        </button>

        <p className="text-xs text-warm-900/50 mt-4 text-center">
          Demo: admin@demo.ba / admin123
        </p>
      </form>
    </div>
  );
}
