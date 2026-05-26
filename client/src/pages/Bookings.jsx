import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api.js';
import Toast from '../components/Toast.jsx';

const STATUS_LABELS = {
  pending: 'Na čekanju',
  confirmed: 'Potvrđena',
  cancelled: 'Otkazana',
  no_show: 'Nije se pojavio',
};

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-200 text-gray-700',
  no_show: 'bg-red-100 text-red-800',
};

const POLL_INTERVAL_MS = 30_000;

function todayStr() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

function isPast(dateStr, timeStr) {
  // Booking is "past" when its date+time is strictly before now.
  const [h, m] = (timeStr || '00:00').split(':').map(Number);
  const d = new Date(`${dateStr}T00:00:00`);
  d.setHours(h || 0, m || 0, 0, 0);
  return d.getTime() < Date.now();
}

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  // Track latest booking id we've seen, to detect *new* bookings during polling.
  const lastMaxIdRef = useRef(null);
  // Initial-load guard — don't toast on first fetch.
  const initializedRef = useRef(false);

  const fetchBookings = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const list = await api.listBookings(date ? { date } : {});

      // Detect new bookings via max id.
      const maxId = list.reduce((m, b) => Math.max(m, b.id), 0);
      if (initializedRef.current && maxId > (lastMaxIdRef.current || 0)) {
        setToast('Nova rezervacija primljena!');
      }
      lastMaxIdRef.current = maxId;
      initializedRef.current = true;

      setBookings(list);
    } catch (e) {
      if (!silent) setError('Greška pri učitavanju rezervacija.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Reset polling baseline when filter changes
  useEffect(() => {
    initializedRef.current = false;
    lastMaxIdRef.current = null;
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // Polling loop
  useEffect(() => {
    const id = setInterval(() => fetchBookings({ silent: true }), POLL_INTERVAL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const updateStatus = async (id, status) => {
    try {
      const updated = await api.updateBooking(id, status);
      setBookings((b) => b.map((x) => (x.id === id ? updated : x)));
    } catch (e) {
      setError('Greška pri ažuriranju statusa.');
    }
  };

  // ----- Summary stats over the current filter ---------------------------
  const summary = bookings.reduce(
    (acc, b) => {
      acc.total += 1;
      acc.guests += b.guests;
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    },
    { total: 0, guests: 0, confirmed: 0, pending: 0, cancelled: 0, no_show: 0 },
  );

  const summaryLabel = date
    ? `za ${date}`
    : `(sve rezervacije)`;

  return (
    <div>
      <Toast message={toast} onClose={() => setToast('')} />

      <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-warm-900">Rezervacije</h1>
          <p className="text-sm text-warm-900/60">Pregled {summaryLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-warm-900/70 uppercase">
            Datum
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-1.5 border border-warm-300 rounded-lg bg-white"
          />
          {date && (
            <button
              onClick={() => setDate('')}
              className="text-xs text-warm-600 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <SummaryCard
          label="Ukupno rezervacija"
          value={summary.total}
        />
        <SummaryCard
          label="Ukupno gostiju"
          value={summary.guests}
        />
        <SummaryCard
          label="Potvrđeno"
          value={summary.confirmed || 0}
          tone="green"
        />
        <SummaryCard
          label="Na čekanju / Otkazano"
          value={`${summary.pending || 0} / ${summary.cancelled || 0}`}
          tone="amber"
        />
      </div>

      {error && (
        <div className="text-sm text-warm-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-warm-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-warm-100 text-warm-900/70 text-left">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Datum / Vrijeme</th>
              <th className="px-4 py-2.5 font-semibold">Gost</th>
              <th className="px-4 py-2.5 font-semibold">Kontakt</th>
              <th className="px-4 py-2.5 font-semibold text-center">Gosti</th>
              <th className="px-4 py-2.5 font-semibold">Napomena</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="px-4 py-2.5 font-semibold text-right">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-100">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-warm-900/50">
                  Učitavanje…
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-warm-900/50">
                  Nema rezervacija.
                </td>
              </tr>
            ) : (
              bookings.map((b) => {
                const past = isPast(b.date, b.time);
                return (
                  <tr key={b.id} className="hover:bg-warm-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-warm-900">{b.date}</div>
                      <div className="text-warm-900/60">{b.time}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-warm-900">
                      {b.guest_name}
                    </td>
                    <td className="px-4 py-3 text-warm-900/80">
                      <div>{b.guest_phone}</div>
                      {b.guest_email && (
                        <div className="text-xs text-warm-900/50">
                          {b.guest_email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center font-medium">
                      {b.guests}
                    </td>
                    <td className="px-4 py-3 text-warm-900/70 max-w-[200px] truncate">
                      {b.note || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[b.status]}`}
                      >
                        {STATUS_LABELS[b.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => updateStatus(b.id, 'confirmed')}
                          disabled={b.status === 'confirmed'}
                          className="px-2 py-1 text-xs rounded bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Potvrdi"
                        >
                          Potvrdi
                        </button>
                        <button
                          onClick={() => updateStatus(b.id, 'cancelled')}
                          disabled={b.status === 'cancelled'}
                          className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Otkaži"
                        >
                          Otkaži
                        </button>
                        <button
                          onClick={() => updateStatus(b.id, 'no_show')}
                          disabled={b.status === 'no_show' || !past}
                          title={
                            !past
                              ? 'Dostupno samo za prošle rezervacije'
                              : 'Označi kao nije se pojavio'
                          }
                          className="px-2 py-1 text-xs rounded bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          No-show
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, tone }) {
  const toneClass =
    tone === 'green'
      ? 'text-green-700'
      : tone === 'amber'
        ? 'text-amber-700'
        : 'text-warm-900';
  return (
    <div className="bg-white border border-warm-200 rounded-xl px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-warm-900/60">
        {label}
      </div>
      <div className={`text-2xl font-bold mt-1 ${toneClass}`}>{value}</div>
    </div>
  );
}
