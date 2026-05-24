import { useEffect, useState } from 'react';
import { api } from '../lib/api.js';

export default function Settings() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.getSettings().then(setForm).catch(() => setError('Greška učitavanja.'));
  }, []);

  if (!form) {
    return <div className="text-warm-900/60">Učitavanje…</div>;
  }

  const set = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const next = await api.saveSettings({
        name: form.name,
        open_time: form.open_time,
        close_time: form.close_time,
        slot_minutes: Number(form.slot_minutes),
        max_per_slot: Number(form.max_per_slot),
      });
      setForm(next);
      setMessage('Postavke su sačuvane.');
    } catch (err) {
      setError('Greška pri čuvanju.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-warm-900 mb-1">Postavke</h1>
      <p className="text-sm text-warm-900/60 mb-6">
        Radno vrijeme, dužina termina i kapacitet po terminu.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-warm-200 rounded-xl p-6 space-y-4"
      >
        <Field label="Naziv restorana">
          <input
            type="text"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            className="input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Otvaranje">
            <input
              type="time"
              value={form.open_time}
              onChange={(e) => set('open_time', e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Zatvaranje">
            <input
              type="time"
              value={form.close_time}
              onChange={(e) => set('close_time', e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Dužina termina (min)">
            <select
              value={form.slot_minutes}
              onChange={(e) => set('slot_minutes', e.target.value)}
              className="input"
            >
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={45}>45</option>
              <option value={60}>60</option>
            </select>
          </Field>
          <Field label="Maks. rezervacija po terminu">
            <input
              type="number"
              min="1"
              max="50"
              value={form.max_per_slot}
              onChange={(e) => set('max_per_slot', e.target.value)}
              className="input"
            />
          </Field>
        </div>

        {message && (
          <div className="text-sm text-green-800 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="text-sm text-warm-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-warm-500 to-warm-600 text-white font-semibold px-5 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {saving ? 'Čuvanje…' : 'Sačuvaj'}
          </button>
        </div>
      </form>

      <style>{`
        .input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d8c8b8;
          border-radius: 0.5rem;
          background: #fff;
          color: #2b1d16;
        }
        .input:focus {
          outline: none;
          border-color: #b54a30;
          box-shadow: 0 0 0 3px rgba(181, 74, 48, 0.15);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-warm-900/70 uppercase mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}
