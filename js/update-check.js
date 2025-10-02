(() => {
  'use strict';

  // ---- config
  const LS_KEY = 'oxyaudit.lastSeenVersion';
  const BANNER_ID = 'update-notice';
  const MSG = 'Update available — tap anywhere to refresh.';
  const CHECK_EVERY_MS = 15 * 60 * 1000;

  // ---- helpers
  const bust = (u) => {
    const x = new URL(u, location.href);
    x.searchParams.set('v', Date.now().toString());
    return x.toString();
  };
  const getSeen = () => { try { return localStorage.getItem(LS_KEY) || ''; } catch { return ''; } };
  const setSeen = (v) => { try { localStorage.setItem(LS_KEY, String(v || '')); } catch {} };

  // ---- force-visible CSS
  function ensureStyles() {
    if (document.getElementById('oxy-update-style')) return;
    const s = document.createElement('style');
    s.id = 'oxy-update-style';
    s.textContent = `
#${BANNER_ID}{
  display:none;
  position:fixed !important;
  left:0 !important; right:0 !important;
  top:calc(env(safe-area-inset-top, 0px) + var(--appbar-height,56px) + .5rem) !important;
  margin:0 auto !important;
  width:min(700px, calc(100% - 1.5rem)) !important;
  background:#ffcc33 !important; color:#333 !important;
  font-weight:600 !important; text-align:center !important;
  padding:0.8rem 1rem !important;
  border:.5px solid #f0c000 !important; border-radius:8px !important;
  box-shadow:0 4px 10px rgba(0,0,0,.25) !important;
  z-index:99999 !important; pointer-events:auto !important; cursor:pointer !important;
  transform:none !important; opacity:1 !important; visibility:visible !important;
}
#${BANNER_ID}.visible{ display:block !important; }
    `;
    document.head.appendChild(s);
  }

  // ---- banner element
  function ensureBanner() {
    let n = document.getElementById(BANNER_ID);
    if (!n) {
      n = document.createElement('div');
      n.id = BANNER_ID;
      document.body.appendChild(n);
    }
    n.textContent = MSG;
    n.classList.add('visible');
    return n;
  }

  // ---- hard refresh
  async function hardRefresh() {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister().catch(()=>{})));
      }
      if (self.caches?.keys) {
        const names = await caches.keys();
        await Promise.all(names.map(k => caches.delete(k).catch(()=>{})));
      }
    } catch {}
    location.replace(bust(location.href));
  }

  // ---- click-anywhere once armed
  let armedGlobal = false;
  function armGlobalTap() {
    if (armedGlobal) return;
    armedGlobal = true;
    const act = (e) => { e?.preventDefault?.(); e?.stopPropagation?.(); hardRefresh(); };
    window.addEventListener('click', act, { capture: true, once: true });
    window.addEventListener('touchend', act, { capture: true, once: true, passive: false });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') act(e);
    }, { capture: true, once: true });
  }

  // ---- version check
  async function fetchRemoteVersion() {
    try {
      const res = await fetch(bust('./version.json'), { cache: 'no-store' });
      if (!res.ok) return null;
      const j = await res.json();
      const v = j && (j.version || j.v);
      return v ? String(v) : null;
    } catch { return null; }
  }

  async function checkNow() {
    ensureStyles();
    const remote = await fetchRemoteVersion();
    if (!remote) return false;
    if (getSeen() === remote) return false;

    const n = ensureBanner();
    setSeen(remote);          // prevent loop after reload
    armGlobalTap();           // click anywhere triggers refresh
    n.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); hardRefresh(); }, { once: true });
    return true;
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => { checkNow(); }, { once: true });
    } else {
      checkNow();
    }
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkNow();
    });
    setInterval(checkNow, CHECK_EVERY_MS);
  }

  // Expose test hooks
  Object.defineProperty(window, '__oxyUpdate', {
    value: {
      checkNow,
      clearSeen: () => setSeen(''),
      _forceShow: () => { ensureStyles(); ensureBanner().classList.add('visible'); armGlobalTap(); }
    },
    writable: false
  });

  init();
})();
