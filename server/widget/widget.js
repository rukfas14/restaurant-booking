(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // Resolve config from the current <script> tag
  // -------------------------------------------------------------------------
  const currentScript =
    document.currentScript ||
    (function () {
      const scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();

  const restaurantId = currentScript.getAttribute('data-restaurant-id') || '1';
  const apiBase =
    currentScript.getAttribute('data-api') ||
    (function () {
      try {
        const src = new URL(currentScript.src, window.location.href);
        return src.origin;
      } catch (e) {
        return '';
      }
    })();

  const buttonLabel =
    currentScript.getAttribute('data-label') || 'Rezerviši stol';

  // -------------------------------------------------------------------------
  // CSS — scoped inside the shadow root
  // -------------------------------------------------------------------------
  const css = `
    :host { all: initial; }
    *, *::before, *::after { box-sizing: border-box; }
    .rb-btn {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 15px;
      font-weight: 600;
      color: #fff;
      background: linear-gradient(135deg, #b54a30 0%, #8c2f1f 100%);
      border: none;
      border-radius: 10px;
      padding: 12px 22px;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(140, 47, 31, 0.25);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .rb-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 22px rgba(140, 47, 31, 0.32); }
    .rb-btn:active { transform: translateY(0); }

    .rb-backdrop {
      position: fixed; inset: 0;
      background: rgba(20, 12, 8, 0.55);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center; justify-content: center;
      z-index: 2147483646;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .rb-backdrop.open { display: flex; }

    .rb-modal {
      width: 100%;
      max-width: 460px;
      max-height: 92vh;
      overflow-y: auto;
      background: #fbf7f3;
      border-radius: 18px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.35);
      color: #2b1d16;
      animation: rb-pop 0.18s ease-out;
    }
    @keyframes rb-pop {
      from { transform: scale(0.96); opacity: 0; }
      to   { transform: scale(1);    opacity: 1; }
    }

    .rb-header {
      padding: 22px 24px 0 24px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .rb-title { margin: 0; font-size: 20px; font-weight: 700; color: #2b1d16; }
    .rb-subtitle { margin: 4px 0 0 0; font-size: 13px; color: #7a5e4d; }
    .rb-close {
      background: transparent; border: none; cursor: pointer;
      font-size: 22px; line-height: 1; color: #7a5e4d;
      padding: 4px 8px; border-radius: 6px;
    }
    .rb-close:hover { background: rgba(0,0,0,0.05); }

    .rb-steps {
      display: flex; gap: 6px; padding: 16px 24px 0 24px;
    }
    .rb-step-col { flex: 1; display: flex; flex-direction: column; gap: 5px; }
    .rb-step-bar { height: 4px; border-radius: 2px; background: #e7ddd2; }
    .rb-step-col.active .rb-step-bar { background: #b54a30; }
    .rb-step-col.done .rb-step-bar { background: #b54a30; opacity: 0.55; }
    .rb-step-label {
      font-size: 10px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-weight: 600;
      color: #b8a08f;
      text-align: center;
    }
    .rb-step-col.active .rb-step-label { color: #b54a30; }
    .rb-step-col.done .rb-step-label { color: #8c5a44; }

    .rb-body { padding: 18px 24px 24px 24px; }

    .rb-label {
      display: block;
      font-size: 12px; font-weight: 600;
      color: #5e4636; text-transform: uppercase;
      letter-spacing: 0.04em;
      margin: 14px 0 6px 0;
    }
    .rb-input, .rb-textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #d8c8b8;
      border-radius: 10px;
      font-size: 15px;
      font-family: inherit;
      background: #fff;
      color: #2b1d16;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .rb-input:focus, .rb-textarea:focus {
      border-color: #b54a30;
      box-shadow: 0 0 0 3px rgba(181, 74, 48, 0.15);
    }
    .rb-textarea { resize: vertical; min-height: 70px; }

    .rb-slot-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(78px, 1fr));
      gap: 8px;
      margin-top: 10px;
    }
    .rb-slot {
      padding: 9px 6px;
      background: #fff;
      border: 1px solid #d8c8b8;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      color: #2b1d16;
      transition: all 0.12s;
    }
    .rb-slot:hover { border-color: #b54a30; color: #b54a30; }
    .rb-slot.selected {
      background: #b54a30; color: #fff; border-color: #b54a30;
    }

    .rb-guests {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
      margin-top: 10px;
    }
    .rb-guest {
      padding: 12px 6px;
      background: #fff;
      border: 1px solid #d8c8b8;
      border-radius: 10px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      color: #2b1d16;
    }
    .rb-guest.selected {
      background: #b54a30; color: #fff; border-color: #b54a30;
    }

    .rb-actions {
      display: flex; gap: 10px;
      margin-top: 22px;
    }
    .rb-action {
      flex: 1;
      padding: 11px 16px;
      border-radius: 10px;
      font-size: 15px; font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      font-family: inherit;
    }
    .rb-action.primary {
      background: linear-gradient(135deg, #b54a30 0%, #8c2f1f 100%);
      color: #fff;
    }
    .rb-action.primary:disabled {
      background: #c9b3a4; cursor: not-allowed; box-shadow: none;
    }
    .rb-action.secondary {
      background: transparent; color: #5e4636;
      border-color: #d8c8b8;
    }
    .rb-action.secondary:hover { background: #f0e7dc; }

    .rb-summary {
      background: #fff;
      border: 1px solid #e7ddd2;
      border-radius: 12px;
      padding: 14px 16px;
      margin-top: 10px;
    }
    .rb-summary-row {
      display: flex; justify-content: space-between;
      padding: 6px 0;
      font-size: 14px;
    }
    .rb-summary-row + .rb-summary-row { border-top: 1px solid #f0e7dc; }
    .rb-summary-label { color: #7a5e4d; }
    .rb-summary-value { color: #2b1d16; font-weight: 600; }

    .rb-success {
      text-align: center;
      padding: 16px 0 4px 0;
    }
    .rb-success-icon {
      width: 56px; height: 56px; margin: 0 auto 12px auto;
      border-radius: 50%;
      background: #e6f2e6; color: #2e7d32;
      display: flex; align-items: center; justify-content: center;
      font-size: 30px; font-weight: 700;
    }
    .rb-success-title { font-size: 18px; font-weight: 700; margin: 0 0 6px 0; }
    .rb-success-text { font-size: 14px; color: #5e4636; margin: 0; }

    .rb-error {
      color: #8c2f1f;
      background: #fbe9e6;
      border: 1px solid #f1c5bf;
      padding: 10px 12px;
      border-radius: 8px;
      font-size: 13px;
      margin-top: 12px;
    }

    .rb-empty {
      color: #7a5e4d;
      font-size: 14px;
      text-align: center;
      padding: 18px 0;
    }

    @media (max-width: 480px) {
      .rb-guests { grid-template-columns: repeat(5, 1fr); }
    }
  `;

  // -------------------------------------------------------------------------
  // Build container + shadow root
  // -------------------------------------------------------------------------
  const host = document.createElement('div');
  host.setAttribute('data-restaurant-booking-widget', '');
  document.body.appendChild(host);
  const root = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = css;
  root.appendChild(style);

  // Trigger button — appended where the script lives, so the site author can
  // place <script> exactly where they want the button. Falls back to body.
  const triggerHost = document.createElement('div');
  triggerHost.setAttribute('data-restaurant-booking-trigger', '');
  const triggerRoot = triggerHost.attachShadow({ mode: 'open' });
  const triggerStyle = document.createElement('style');
  triggerStyle.textContent = css;
  triggerRoot.appendChild(triggerStyle);

  const triggerBtn = document.createElement('button');
  triggerBtn.className = 'rb-btn';
  triggerBtn.textContent = buttonLabel;
  triggerRoot.appendChild(triggerBtn);

  if (currentScript.parentNode) {
    currentScript.parentNode.insertBefore(triggerHost, currentScript);
  } else {
    document.body.appendChild(triggerHost);
  }

  // -------------------------------------------------------------------------
  // Modal markup
  // -------------------------------------------------------------------------
  const backdrop = document.createElement('div');
  backdrop.className = 'rb-backdrop';
  backdrop.innerHTML = `
    <div class="rb-modal" role="dialog" aria-modal="true">
      <div class="rb-header">
        <div>
          <h2 class="rb-title">Rezervacija stola</h2>
          <p class="rb-subtitle" data-rb="restaurant-name">&nbsp;</p>
        </div>
        <button class="rb-close" aria-label="Zatvori">&times;</button>
      </div>
      <div class="rb-steps">
        <div class="rb-step-col" data-step="1">
          <div class="rb-step-bar"></div>
          <div class="rb-step-label">Datum</div>
        </div>
        <div class="rb-step-col" data-step="2">
          <div class="rb-step-bar"></div>
          <div class="rb-step-label">Gosti</div>
        </div>
        <div class="rb-step-col" data-step="3">
          <div class="rb-step-bar"></div>
          <div class="rb-step-label">Podaci</div>
        </div>
        <div class="rb-step-col" data-step="4">
          <div class="rb-step-bar"></div>
          <div class="rb-step-label">Potvrda</div>
        </div>
      </div>
      <div class="rb-body" data-rb="body"></div>
    </div>
  `;
  root.appendChild(backdrop);

  // -------------------------------------------------------------------------
  // State + helpers
  // -------------------------------------------------------------------------
  const state = {
    step: 1,
    date: '',
    time: '',
    guests: 2,
    name: '',
    phone: '',
    email: '',
    note: '',
    slots: [],
    loadingSlots: false,
    restaurantName: '',
    submitting: false,
    error: '',
  };

  function todayLocal() {
    const d = new Date();
    const tz = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tz).toISOString().slice(0, 10);
  }

  function api(path, opts = {}) {
    return fetch(apiBase + path, {
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    }).then(async (r) => {
      const body = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(body.error || 'request_failed');
      return body;
    });
  }

  function updateSteps() {
    const steps = backdrop.querySelectorAll('.rb-step-col');
    steps.forEach((el) => {
      const n = Number(el.getAttribute('data-step'));
      el.classList.remove('active', 'done');
      if (n < state.step) el.classList.add('done');
      if (n === state.step) el.classList.add('active');
    });
  }

  function open() {
    state.step = 1;
    state.date = todayLocal();
    state.time = '';
    state.guests = 2;
    state.name = '';
    state.phone = '';
    state.email = '';
    state.note = '';
    state.error = '';
    state.submitting = false;
    state.slots = [];
    state.loadingSlots = false;
    backdrop.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
    loadRestaurantName();
    render();
  }

  function close() {
    backdrop.classList.remove('open');
    document.documentElement.style.overflow = '';
  }

  function loadRestaurantName() {
    if (state.restaurantName) {
      backdrop.querySelector('[data-rb="restaurant-name"]').textContent =
        state.restaurantName;
      return;
    }
    api(`/api/restaurants/${restaurantId}`)
      .then((r) => {
        state.restaurantName = r.name || '';
        backdrop.querySelector('[data-rb="restaurant-name"]').textContent =
          state.restaurantName;
      })
      .catch(() => {});
  }

  function loadSlots() {
    state.loadingSlots = true;
    state.slots = [];
    render();
    api(
      `/api/restaurants/${restaurantId}/slots?date=${encodeURIComponent(state.date)}`,
    )
      .then((r) => {
        state.slots = r.slots || [];
        state.loadingSlots = false;
        render();
      })
      .catch(() => {
        state.loadingSlots = false;
        state.error = 'Nije moguće učitati termine. Pokušajte ponovo.';
        render();
      });
  }

  // -------------------------------------------------------------------------
  // Render per step
  // -------------------------------------------------------------------------
  function render() {
    updateSteps();
    const body = backdrop.querySelector('[data-rb="body"]');
    if (state.step === 1) renderStep1(body);
    else if (state.step === 2) renderStep2(body);
    else if (state.step === 3) renderStep3(body);
    else if (state.step === 4) renderStep4(body);
  }

  function renderStep1(body) {
    body.innerHTML = `
      <label class="rb-label">Datum</label>
      <input class="rb-input" type="date" data-rb="date" value="${state.date}" min="${todayLocal()}" />

      <label class="rb-label">Vrijeme</label>
      <div class="rb-slot-grid" data-rb="slots">
        ${
          state.loadingSlots
            ? '<div class="rb-empty">Učitavanje termina…</div>'
            : state.slots.length === 0
              ? '<div class="rb-empty">Nema dostupnih termina za ovaj datum.</div>'
              : state.slots
                  .map(
                    (s) => `
                      <button class="rb-slot ${state.time === s.time ? 'selected' : ''}" data-time="${s.time}">
                        ${s.time}
                      </button>`,
                  )
                  .join('')
        }
      </div>

      ${state.error ? `<div class="rb-error">${state.error}</div>` : ''}

      <div class="rb-actions">
        <button class="rb-action secondary" data-rb="cancel">Otkaži</button>
        <button class="rb-action primary" data-rb="next" ${state.time ? '' : 'disabled'}>Dalje</button>
      </div>
    `;
    body.querySelector('[data-rb="date"]').addEventListener('change', (e) => {
      state.date = e.target.value;
      state.time = '';
      state.error = '';
      loadSlots();
    });
    body.querySelectorAll('.rb-slot').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.time = btn.getAttribute('data-time');
        render();
      });
    });
    body.querySelector('[data-rb="cancel"]').addEventListener('click', close);
    body.querySelector('[data-rb="next"]').addEventListener('click', () => {
      if (!state.time) return;
      state.step = 2;
      render();
    });

    if (state.slots.length === 0 && !state.loadingSlots && !state.error) {
      loadSlots();
    }
  }

  function renderStep2(body) {
    body.innerHTML = `
      <label class="rb-label">Broj gostiju</label>
      <div class="rb-guests">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
          .map(
            (n) => `
              <button class="rb-guest ${state.guests === n ? 'selected' : ''}" data-n="${n}">${n}</button>
            `,
          )
          .join('')}
      </div>

      <div class="rb-actions">
        <button class="rb-action secondary" data-rb="back">Nazad</button>
        <button class="rb-action primary" data-rb="next">Dalje</button>
      </div>
    `;
    body.querySelectorAll('.rb-guest').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.guests = Number(btn.getAttribute('data-n'));
        render();
      });
    });
    body.querySelector('[data-rb="back"]').addEventListener('click', () => {
      state.step = 1;
      render();
    });
    body.querySelector('[data-rb="next"]').addEventListener('click', () => {
      state.step = 3;
      render();
    });
  }

  function renderStep3(body) {
    body.innerHTML = `
      <label class="rb-label">Ime i prezime</label>
      <input class="rb-input" type="text" data-rb="name" value="${escapeHtml(state.name)}" placeholder="npr. Ime Prezime" />

      <label class="rb-label">Broj telefona</label>
      <input class="rb-input" type="tel" data-rb="phone" value="${escapeHtml(state.phone)}" placeholder="+387 ..." />

      <label class="rb-label">Email</label>
      <input class="rb-input" type="email" data-rb="email" value="${escapeHtml(state.email)}" placeholder="ime@primjer.ba" />

      <label class="rb-label">Napomena (opcionalno)</label>
      <textarea class="rb-textarea" data-rb="note" placeholder="npr. sto pored prozora">${escapeHtml(state.note)}</textarea>

      ${state.error ? `<div class="rb-error">${state.error}</div>` : ''}

      <div class="rb-actions">
        <button class="rb-action secondary" data-rb="back">Nazad</button>
        <button class="rb-action primary" data-rb="submit" ${state.submitting ? 'disabled' : ''}>
          ${state.submitting ? 'Slanje…' : 'Potvrdi rezervaciju'}
        </button>
      </div>
    `;
    const nameEl = body.querySelector('[data-rb="name"]');
    const phoneEl = body.querySelector('[data-rb="phone"]');
    const emailEl = body.querySelector('[data-rb="email"]');
    const noteEl = body.querySelector('[data-rb="note"]');
    nameEl.addEventListener('input', (e) => (state.name = e.target.value));
    phoneEl.addEventListener('input', (e) => (state.phone = e.target.value));
    emailEl.addEventListener('input', (e) => (state.email = e.target.value));
    noteEl.addEventListener('input', (e) => (state.note = e.target.value));

    body.querySelector('[data-rb="back"]').addEventListener('click', () => {
      state.step = 2;
      state.error = '';
      render();
    });
    body.querySelector('[data-rb="submit"]').addEventListener('click', submit);
  }

  function renderStep4(body) {
    body.innerHTML = `
      <div class="rb-success">
        <div class="rb-success-icon">✓</div>
        <h3 class="rb-success-title">Rezervacija poslana!</h3>
        <p class="rb-success-text">Hvala vam. Vidimo se uskoro.</p>
        ${
          state.email
            ? `<p class="rb-success-text" style="margin-top:6px;">Potvrda je poslana na vašu email adresu.</p>`
            : ''
        }
      </div>

      <div class="rb-summary">
        <div class="rb-summary-row">
          <span class="rb-summary-label">Datum</span>
          <span class="rb-summary-value">${state.date}</span>
        </div>
        <div class="rb-summary-row">
          <span class="rb-summary-label">Vrijeme</span>
          <span class="rb-summary-value">${state.time}</span>
        </div>
        <div class="rb-summary-row">
          <span class="rb-summary-label">Broj gostiju</span>
          <span class="rb-summary-value">${state.guests}</span>
        </div>
        <div class="rb-summary-row">
          <span class="rb-summary-label">Ime</span>
          <span class="rb-summary-value">${escapeHtml(state.name)}</span>
        </div>
        <div class="rb-summary-row">
          <span class="rb-summary-label">Telefon</span>
          <span class="rb-summary-value">${escapeHtml(state.phone)}</span>
        </div>
        ${
          state.email
            ? `<div class="rb-summary-row">
                 <span class="rb-summary-label">Email</span>
                 <span class="rb-summary-value">${escapeHtml(state.email)}</span>
               </div>`
            : ''
        }
      </div>

      <div class="rb-actions">
        <button class="rb-action primary" data-rb="close">Zatvori</button>
      </div>
    `;
    body.querySelector('[data-rb="close"]').addEventListener('click', close);
  }

  function submit() {
    state.error = '';
    if (!state.name.trim() || !state.phone.trim() || !state.email.trim()) {
      state.error = 'Molimo unesite ime, broj telefona i email.';
      render();
      return;
    }
    const emailValue = state.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      state.error = 'Molimo unesite ispravnu email adresu.';
      render();
      return;
    }
    state.submitting = true;
    render();
    api('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        restaurant_id: Number(restaurantId),
        name: state.name.trim(),
        phone: state.phone.trim(),
        email: emailValue,
        guests: state.guests,
        date: state.date,
        time: state.time,
        note: state.note.trim() || null,
      }),
    })
      .then(() => {
        state.submitting = false;
        state.step = 4;
        render();
      })
      .catch((err) => {
        state.submitting = false;
        if (err.message === 'slot_full') {
          state.error =
            'Žao nam je, taj termin je popunjen. Molimo izaberite drugi.';
          state.step = 1;
          state.time = '';
          loadSlots();
        } else {
          state.error = 'Slanje nije uspjelo. Pokušajte ponovo.';
        }
        render();
      });
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // -------------------------------------------------------------------------
  // Wire trigger + global close behaviors
  // -------------------------------------------------------------------------
  triggerBtn.addEventListener('click', open);
  backdrop.querySelector('.rb-close').addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) close();
  });

  // Expose minimal global handle for programmatic use
  window.RestaurantBooking = { open, close };
})();
