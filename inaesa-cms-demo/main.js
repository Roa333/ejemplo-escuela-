/* INAESA demo — carga contenido editable (content/avisos.json y content/info.json) e interacción de la página. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('#year').textContent = new Date().getFullYear();

  /* Menú móvil */
  const toggle = $('.menu-toggle'), mnav = $('#mobile-nav');
  toggle?.addEventListener('click', () => {
    const open = mnav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('a', mnav).forEach(a => a.addEventListener('click', () => { mnav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }));

  /* Scroll-reveal */
  const revealEls = $$('.reveal-hidden');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('reveal-visible'); e.target.classList.remove('reveal-hidden'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el, i) => { el.style.transitionDelay = `${(i % 3) * 70}ms`; io.observe(el); });
  } else {
    revealEls.forEach(el => el.classList.remove('reveal-hidden'));
  }

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtFecha = (iso) => { try { return new Date(iso + 'T00:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return iso; } };

  /* Avisos: se editan en /admin, se guardan en content/avisos.json */
  async function loadAvisos() {
    const list = $('#avisos-list');
    try {
      const res = await fetch('content/avisos.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('http ' + res.status);
      const data = await res.json();
      const avisos = (data.avisos || [])
        .filter(a => a.publicado !== false)
        .sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));

      if (!avisos.length) { list.innerHTML = '<p class="avisos-empty">Por ahora no hay avisos publicados.</p>'; return; }

      list.innerHTML = avisos.map(a => `
        <article class="aviso-card">
          <span class="aviso-tag">${esc(a.categoria || 'Aviso')}</span>
          <span class="aviso-fecha">${esc(fmtFecha(a.fecha))}</span>
          <h3>${esc(a.titulo)}</h3>
          <p>${esc(a.resumen || '')}</p>
        </article>`).join('');
    } catch (err) {
      list.innerHTML = '<p class="avisos-error">No se pudieron cargar los avisos en este momento.</p>';
    }
  }

  /* Información de contacto: también editable desde /admin (content/info.json) */
  async function loadInfo() {
    try {
      const res = await fetch('content/info.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('http ' + res.status);
      const info = await res.json();
      $('#c-direccion').textContent = info.direccion || '—';
      $('#c-telefono').textContent = info.telefono || '—';
      $('#c-correo').textContent = info.correo || '—';
      $('#c-horario').textContent = info.horario || '—';
      $('#c-mensaje').textContent = info.mensaje_director || '—';

      const wa = $('#wa-link');
      if (wa && info.whatsapp) {
        wa.href = `https://wa.me/${info.whatsapp}?text=${encodeURIComponent('Hola, quisiera informes de admisiones.')}`;
      }
    } catch {
      /* deja los guiones por defecto si falla */
    }
  }

  loadAvisos();
  loadInfo();
})();
