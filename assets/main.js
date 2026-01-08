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
    const text = encodeURIComponent(message || 'Hi Miran Hotels, I want to enquire about a booking.');
    const phone = String(phoneE164 || '').replace(/[^\d]/g, '');
    return `https://wa.me/${phone}?text=${text}`;
  };

  // Icons (inline SVG)
  window.miranIcon = function (name) {
    const icons = {
      whatsapp: '<svg class="icon" viewBox="0 0 32 32" aria-hidden="true"><path d="M19.11 17.57c-.28-.14-1.65-.81-1.9-.9-.25-.09-.44-.14-.62.14-.18.28-.71.9-.87 1.08-.16.18-.32.21-.6.07-.28-.14-1.16-.43-2.21-1.38-.82-.73-1.38-1.64-1.54-1.91-.16-.28-.02-.43.12-.57.12-.12.28-.32.41-.48.14-.16.18-.28.28-.46.09-.18.05-.35-.02-.5-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.46.07-.71.35-.25.28-.94.92-.94 2.25 0 1.33.97 2.61 1.11 2.79.14.18 1.91 2.91 4.63 4.08.65.28 1.16.45 1.56.58.66.21 1.27.18 1.75.11.53-.08 1.65-.67 1.88-1.32.23-.64.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32zM16.06 26.67h-.01c-1.76 0-3.49-.47-5.01-1.36l-.36-.21-3.73.98.99-3.63-.24-.37a10.54 10.54 0 0 1-1.63-5.62c0-5.84 4.77-10.59 10.64-10.59 2.84 0 5.51 1.1 7.52 3.1a10.52 10.52 0 0 1 3.12 7.49c0 5.84-4.77 10.59-10.29 10.21zM16.06 4C9.39 4 4 9.37 4 16c0 2.06.55 4.08 1.59 5.86L4 28l6.33-1.66A12 12 0 0 0 16.06 28C22.7 28 28 22.63 28 16S22.7 4 16.06 4z"/></svg>',
      phone: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2.1.6 3.2.6.7 0 1.3.6 1.3 1.3V20c0 .7-.6 1.3-1.3 1.3C10.8 21.3 2.7 13.2 2.7 3.3 2.7 2.6 3.3 2 4 2h3c.7 0 1.3.6 1.3 1.3 0 1.1.2 2.2.6 3.2.1.4 0 .9-.2 1.2L6.6 10.8z"/></svg>',
      map: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C8.7 2 6 4.7 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.3-2.7-6-6-6zm0 8.5A2.5 2.5 0 1 1 12 5a2.5 2.5 0 0 1 0 5.5z"/></svg>'
    };
    return icons[name] || '';
  };

  // Carousel
  function initCarousel(root) {
    const track = root.querySelector('.carousel-track');
    const slides = Array.from(root.querySelectorAll('.carousel-slide'));
    if (!track || slides.length <= 1) return;

    let index = 0;
    const autoplayMs = Number(root.getAttribute('data-autoplay')) || 0;
    const dotsWrap = root.querySelector('.carousel-dots');
    const prevBtn = root.querySelector('[data-carousel-prev]');
    const nextBtn = root.querySelector('[data-carousel-next]');

    function setIndex(i, user) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translate3d(${-index * 100}%,0,0)`;
      if (dotsWrap) {
        dotsWrap.querySelectorAll('.carousel-dot').forEach((d, di) => {
          d.setAttribute('aria-current', di === index ? 'true' : 'false');
        });
      }
      if (user) stopAutoplay();
    }

    if (dotsWrap && dotsWrap.childElementCount === 0) {
      slides.forEach((_, di) => {
        const b = document.createElement('button');
        b.className = 'carousel-dot';
        b.type = 'button';
        b.setAttribute('aria-label', `Go to slide ${di + 1}`);
        b.setAttribute('aria-current', di === 0 ? 'true' : 'false');
        b.addEventListener('click', () => setIndex(di, true));
        dotsWrap.appendChild(b);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => setIndex(index - 1, true));
    if (nextBtn) nextBtn.addEventListener('click', () => setIndex(index + 1, true));

    // swipe
    let startX = 0, dx = 0, isDown = false;
    function onDown(x) { isDown = true; startX = x; dx = 0; }
    function onMove(x) { if (!isDown) return; dx = x - startX; }
    function onUp() {
      if (!isDown) return;
      isDown = false;
      if (Math.abs(dx) > 40) setIndex(index + (dx < 0 ? 1 : -1), true);
    }
    root.addEventListener('touchstart', (e) => onDown(e.touches[0].clientX), { passive: true });
    root.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX), { passive: true });
    root.addEventListener('touchend', onUp);

    // autoplay
    let timer = null;
    function startAutoplay() {
      if (!autoplayMs || timer) return;
      timer = setInterval(() => setIndex(index + 1, false), autoplayMs);
    }
    function stopAutoplay() {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    }
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay(); else startAutoplay();
    });

    startAutoplay();
    setIndex(0, false);
  }

  // Image normalization + lazy + jpg<->jpeg fallback
  function swapExt(url) {
    if (!url) return null;
    if (url.toLowerCase().endsWith('.jpeg')) return url.replace(/\.jpeg$/i, '.jpg');
    if (url.toLowerCase().endsWith('.jpg')) return url.replace(/\.jpg$/i, '.jpeg');
    return null;
  }
  function ensureRootImages(url) {
    if (!url) return url;
    if (/^https?:\/\//i.test(url) || /^data:/i.test(url)) return url;
    const m = url.match(/(?:^|\/)(images\/.*)$/i);
    if (m && m[1]) return '/' + m[1].replace(/^\/+/, '');
    return url;
  }

  document.addEventListener('DOMContentLoaded', () => {
    // WhatsApp wiring
    document.querySelectorAll('a[data-wa]').forEach((a) => {
      const phone = a.getAttribute('data-wa-phone') || '9266134138';
      const msg = a.getAttribute('data-wa-message') || 'Hi Miran Hotels, I want to enquire.';
      a.href = window.miranWhatsApp(phone, msg);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });

    // Icon injection
    document.querySelectorAll('[data-icon]').forEach((el) => {
      const name = el.getAttribute('data-icon');
      if (!name) return;
      if (el.querySelector('.icon')) return;
      el.insertAdjacentHTML('afterbegin', window.miranIcon(name));
    });

    // Carousel init
    document.querySelectorAll('[data-carousel]').forEach(initCarousel);

    // image helpers
    Array.from(document.images || []).forEach((img) => {
      if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');

      const src = img.getAttribute('src');
      const normalized = ensureRootImages(src);
      if (normalized && normalized !== src) img.setAttribute('src', normalized);

      img.addEventListener('error', function () {
        if (img.dataset.extTried === '2') return;
        const currentSrc = img.getAttribute('src') || img.src;

        if (img.dataset.extTried !== '1') {
          const alt = swapExt(currentSrc);
          if (alt && alt !== currentSrc) {
            img.dataset.extTried = '1';
            img.src = alt;
            return;
          }
        }
        const encoded = (currentSrc || '').replace(/ /g, '%20');
        img.dataset.extTried = '2';
        img.src = encoded;
      });
    });
  });
})();