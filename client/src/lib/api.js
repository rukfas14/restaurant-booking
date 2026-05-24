const TOKEN_KEY = 'rb_token';
const USER_KEY = 'rb_user';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const v = localStorage.getItem(USER_KEY);
  return v ? JSON.parse(v) : null;
}

export function setSession(token, user, restaurant) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, restaurant }));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request(path, opts = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(path, { ...opts, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || 'request_failed');
    err.status = res.status;
    throw err;
  }
  return body;
}

export const api = {
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  listBookings: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v),
    ).toString();
    return request(`/api/bookings${qs ? `?${qs}` : ''}`);
  },
  updateBooking: (id, status) =>
    request(`/api/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  getSettings: () => request('/api/settings'),
  saveSettings: (data) =>
    request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
