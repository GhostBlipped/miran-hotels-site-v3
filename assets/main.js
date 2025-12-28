(function () {
  // Mobile menu toggle
  const toggle = document.querySelector('[data-nav-toggle]');
  const mobile = document.querySelector('[data-mobile-menu]');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      mobile.classList.toggle('hide');
      toggle.setAttribute('aria-expanded', mobile.classList.contains('hide') ? 'false' : 'true');
    });
  }

  // Smooth scroll for same-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });

  // WhatsApp helper
  window.miranWhatsApp = function (phoneE164, message) {
    const text = encodeURIComponent(message || "Hi Miran Hotels, I want to enquire about a booking.");
    const phone = String(phoneE164 || '').replace(/[^\d]/g, '');
    return `https://wa.me/${phone}?text=${text}`;
  };
})();
// --- Image fallback helper (jpg <-> jpeg) ---
(function () {
  function swapExt(url) {
    try {
      const u = new URL(url, window.location.origin);
      const p = u.pathname;
      if (p.toLowerCase().endsWith('.jpeg')) return u.pathname.replace(/\.jpeg$/i, '.jpg') + u.search;
      if (p.toLowerCase().endsWith('.jpg')) return u.pathname.replace(/\.jpg$/i, '.jpeg') + u.search;
      return null;
    } catch (e) {
      if ((url || "").toLowerCase().endsWith('.jpeg')) return url.replace(/\.jpeg$/i, '.jpg');
      if ((url || "").toLowerCase().endsWith('.jpg')) return url.replace(/\.jpg$/i, '.jpeg');
      return null;
    }
  }

  function ensureRootImages(url) {
    if (!url) return url;
    if (/^https?:\/\//i.test(url) || /^data:/i.test(url)) return url;
    const m = url.match(/(?:^|\/)(images\/.*)$/i);
    if (m && m[1]) return '/' + m[1].replace(/^\/+/, '');
    return url;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const imgs = Array.from(document.images || []);
    imgs.forEach((img) => {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');

      const src = img.getAttribute('src');
      const normalized = ensureRootImages(src);
      if (normalized && normalized !== src) img.setAttribute('src', normalized);

      img.addEventListener('error', function () {
        if (img.dataset.extTried === '2') return;
        const currentSrc = img.getAttribute('src') || img.src;

        // 1) Try jpg<->jpeg swap
        if (img.dataset.extTried !== '1') {
          const alt = swapExt(currentSrc);
          if (alt && alt !== currentSrc) {
            img.dataset.extTried = '1';
            img.src = alt;
            return;
          }
        }

        // 2) Try encoding spaces if any (common cause when filenames have spaces)
        try {
          const encoded = (currentSrc || '').replace(/ /g, '%20');
          if (encoded && encoded !== currentSrc) {
            img.dataset.extTried = '2';
            img.src = encoded;
          } else {
            img.dataset.extTried = '2';
          }
        } catch (e) {
          img.dataset.extTried = '2';
        }
      });
    });
  });
})();