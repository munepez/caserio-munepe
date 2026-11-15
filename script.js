/* ==========================================================================
   SCRIPT PRINCIPAL · Caserío [MUNEPE]
   JavaScript puro, sin librerías.
   ========================================================================== */

/* --------------------------------------------------------------------------
   CONFIGURACIÓN — cambia aquí tus datos
   -------------------------------------------------------------------------- */
const CONFIG = {
  // Número de WhatsApp con prefijo de país, sin "+" ni espacios (ej. 34612345678).
  // Puedes dejarlo con corchetes o espacios: el código se queda solo con los dígitos.
  whatsappNumero: '[34600000000]',

  // Mensaje que aparece ya escrito al abrir el chat
  whatsappMensaje: 'Hola, he visto la web del Caserío [MUNEPE] y me gustaría recibir más información / concertar una visita.'
};

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initWhatsApp();
  initReveal();
  initGallery();
  initContactForm();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* --------------------------------------------------------------------------
   1. Header: cambia de transparente a sólido al hacer scroll
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.getElementById('header');
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  update();
  window.addEventListener('scroll', update, { passive: true });
}

/* --------------------------------------------------------------------------
   2. Menú móvil (hamburguesa)
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  const header = document.getElementById('header');

  const setOpen = (open) => {
    menu.classList.toggle('hidden', !open);
    header.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };

  btn.addEventListener('click', () => setOpen(menu.classList.contains('hidden')));
  // Cerrar al pulsar un enlace
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
}

/* --------------------------------------------------------------------------
   3. Enlaces de WhatsApp (botón flotante y sección de contacto)
   -------------------------------------------------------------------------- */
function initWhatsApp() {
  const numero = CONFIG.whatsappNumero.replace(/\D/g, '');
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(CONFIG.whatsappMensaje)}`;
  document.querySelectorAll('[data-whatsapp]').forEach((a) => {
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
  });
}

/* --------------------------------------------------------------------------
   4. Animación de aparición al hacer scroll
   -------------------------------------------------------------------------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el) => io.observe(el));
}

/* --------------------------------------------------------------------------
   5. Galería: filtros por categoría + lightbox
   -------------------------------------------------------------------------- */
function initGallery() {
  const grid = document.getElementById('gallery-grid');
  const items = Array.from(grid.querySelectorAll('.gallery-item'));
  const buttons = document.querySelectorAll('.filter-btn');

  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCaption = document.getElementById('lb-caption');
  let visible = items;   // fotos que se ven con el filtro actual
  let current = 0;       // índice de la foto abierta en el lightbox
  let lastFocus = null;

  // --- Filtros ---
  buttons.forEach((btn) => {
    btn.setAttribute('role', 'tab');
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      grid.classList.toggle('is-filtered', filter !== 'all');
      items.forEach((item) => {
        item.classList.toggle('is-hidden', filter !== 'all' && item.dataset.category !== filter);
      });
      visible = items.filter((item) => !item.classList.contains('is-hidden'));
    });
  });

  // --- Abrir lightbox (clic o tecla Enter sobre una foto) ---
  items.forEach((item) => {
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.addEventListener('click', () => open(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(item); }
    });
  });

  function open(item) {
    lastFocus = document.activeElement;
    current = visible.indexOf(item);
    show();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    document.getElementById('lb-close').focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  function show() {
    const img = visible[current].querySelector('img');
    const caption = visible[current].querySelector('figcaption');
    // Usa la imagen que realmente se cargó (la tuya o la de respaldo)
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = `${caption ? caption.textContent : ''}  ·  ${current + 1} / ${visible.length}`;
    // Reinicia la animación
    lbImg.style.animation = 'none'; void lbImg.offsetWidth; lbImg.style.animation = '';
  }

  const step = (dir) => { current = (current + dir + visible.length) % visible.length; show(); };

  document.getElementById('lb-close').addEventListener('click', close);
  document.getElementById('lb-prev').addEventListener('click', () => step(-1));
  document.getElementById('lb-next').addEventListener('click', () => step(1));
  // Cerrar al hacer clic fuera de la foto
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });

  // Teclado: Esc, flechas
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  // Gestos táctiles: deslizar para cambiar de foto
  let touchX = null;
  lightbox.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    touchX = null;
  });
}

/* --------------------------------------------------------------------------
   6. Formulario de contacto (Formspree, envío sin recargar la página)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const btn = document.getElementById('submit-btn');

  const showStatus = (msg, ok) => {
    status.textContent = msg;
    status.className = `mt-4 rounded-xl px-4 py-3 text-sm ${ok ? 'bg-bosque-100 text-bosque-800' : 'bg-red-50 text-red-800'}`;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validación sencilla
    let valid = true;
    form.querySelectorAll('[required]').forEach((field) => {
      const ok = field.type === 'checkbox' ? field.checked : field.checkValidity() && field.value.trim() !== '';
      field.classList.toggle('is-invalid', !ok);
      if (!ok) valid = false;
    });
    if (!valid) {
      showStatus('Revisa los campos marcados: nombre, teléfono, email válido y aceptación de privacidad.', false);
      return;
    }

    // Aviso si aún no se ha configurado Formspree
    if (form.action.includes('%5B') || form.action.includes('[')) {
      showStatus('El formulario aún no está conectado: sustituye [TU_ID_FORMSPREE] en index.html por tu ID de Formspree.', false);
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Enviando…';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        form.reset();
        showStatus('¡Gracias! Hemos recibido tu mensaje y te contactaremos muy pronto.', true);
      } else {
        throw new Error('Respuesta no válida');
      }
    } catch (err) {
      showStatus('No se pudo enviar el mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.', false);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Enviar y pedir visita';
    }
  });

  // Quita el borde rojo en cuanto el usuario corrige el campo
  form.querySelectorAll('.form-input, [type="checkbox"]').forEach((f) =>
    f.addEventListener('input', () => f.classList.remove('is-invalid'))
  );
}
