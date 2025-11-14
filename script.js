/* script.js */
document.addEventListener('DOMContentLoaded', () => {
  /* THEME + PARTICLES */
  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    // re-init particles with color suited to theme
    const particleColor = theme === 'dark' ? '#9FD8A3' : '#B8DDB0';
    const particleOpacity = theme === 'dark' ? 0.95 : 0.92;
    const lineOpacity = theme === 'dark' ? 0.22 : 0.16;
    const particleSize = theme === 'dark' ? 2.6 : 2.4;
    const particleDensity = theme === 'dark' ? 80 : 72;
    initParticles(particleColor, particleOpacity, lineOpacity, particleSize, particleDensity);
  }

  /* PARTICLES.JS INIT (data network style: dots + lines) */
  function initParticles(color = '#C7E6C8', opacity = 0.85, lineOpacity = 0.12, size = 2.2, density = 60) {
    if (window.pJSDom && window.pJSDom.length) {
      try { window.pJSDom.forEach(p => p.pJS.fn.vendors.destroypJS()); window.pJSDom = []; } catch (e) {}
    }
    /* small, gentle network */
    particlesJS('particles-js', {
      particles: {
        number: { value: density, density: { enable: true, value_area: 900 } },
        color: { value: color },
        shape: { type: 'circle' },
        opacity: { value: opacity, random: false, anim: { enable: false } },
        size: { value: size, random: true },
        line_linked: { enable: true, distance: 150, color: color, opacity: lineOpacity, width: 1 },
        move: { enable: true, speed: 0.6, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'repulse' }, resize: true },
        modes: {
          grab: { distance: 200, line_linked: { opacity: Math.min(0.45, lineOpacity + 0.1) } },
          repulse: { distance: 160, duration: 0.4 }
        }
      },
      retina_detect: true
    });
  }

  /* initial particles are initialized by setTheme(savedTheme) earlier; no extra init here */

  /* NAV: mobile overlay */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  mobileToggle.addEventListener('click', () => { mobileMenu.setAttribute('aria-hidden', 'false'); });
  mobileClose.addEventListener('click', () => { mobileMenu.setAttribute('aria-hidden', 'true'); });
  // close mobile on link click
  document.querySelectorAll('.mobile-link').forEach(a => a.addEventListener('click', () => mobileMenu.setAttribute('aria-hidden','true')));

  /* Dropdown for Explore My Work */
  /* Explore dropdown removed - simplified CTA */

  /* taglines rotator (exact copy & timing) */
  const rotator = document.getElementById('rotator');
  const phrases = [
    'Turning insights into actions.',
    'Turning curiosity into impact.',
    'Turning data into stories.'
  ];
  let rIndex = 0;
  function rotateTagline() {
    rotator.classList.remove('fade-in');
    void rotator.offsetWidth;
    rotator.textContent = phrases[rIndex];
    rotator.classList.add('fade-in');
    // choose durations to match requested feel (1-3s cycle approx)
    const durations = [2000, 2200, 2400];
    setTimeout(() => {
      rIndex = (rIndex + 1) % phrases.length;
      rotateTagline();
    }, durations[rIndex]);
  }
  rotateTagline();

  /* AOS init */
  if (window.AOS) AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });

  /* Smooth active nav highlight */
  const navLinks = document.querySelectorAll('.nav-link');
  function onScrollActive() {
    const sections = document.querySelectorAll('main .section, main section');
    const pos = window.scrollY + 140;
    sections.forEach(sec => {
      if (!sec.id) return;
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (pos >= top && pos < bottom) {
        navLinks.forEach(n => n.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', onScrollActive);
  onScrollActive();

  /* PROJECTS: open links in new tab - already set in HTML; no further action */

  /* DATA IN MOTION: clickable metrics */
  document.querySelectorAll('.metric-card').forEach(card => {
    const fill = card.querySelector('.metric-fill');
    const num = card.querySelector('.metric-num');
    const target = parseInt(card.dataset.value || '0', 10);
    let filled = false;
    card.addEventListener('click', () => {
      if (filled) {
        // reset
        fill.style.width = '0%';
        num.textContent = '0%';
        filled = false;
        return;
      }
      filled = true;
      fill.style.width = target + '%';
      // animate number increment
      let current = 0;
      const step = Math.max(1, Math.floor(target / 30));
      const t = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target; clearInterval(t);
        }
        num.textContent = current + '%';
      }, 20);
    });
  });

  /* CONTACT FORM: mailto fallback (only active if the form exists) */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const formStatus = document.getElementById('form-status');
    // If you want real messages to be sent to your inbox, set `FORM_ENDPOINT` to
    // a form endpoint (e.g. Formspree endpoint or your server) below.
    // Example Formspree: 'https://formspree.io/f/your-id'
    const FORM_ENDPOINT = '';

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (formStatus) formStatus.style.color = 'var(--accent-2)';
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      if (!name || !email || !message) {
        if (formStatus) formStatus.textContent = 'Please fill all fields.';
        return;
      }

      // disable submit while sending
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.7'; }

      if (FORM_ENDPOINT) {
        // send to configured endpoint (Formspree / server). Use FormData so it's generic.
        if (formStatus) formStatus.textContent = 'Sending message...';
        fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        }).then(async (res) => {
          if (res.ok) {
            if (formStatus) { formStatus.textContent = 'Message sent — thank you!'; formStatus.style.color = 'var(--accent-2)'; }
            contactForm.reset();
          } else {
            const data = await res.json().catch(() => ({}));
            if (formStatus) { formStatus.textContent = data.error || 'Failed to send message. Please try again.'; formStatus.style.color = 'crimson'; }
          }
        }).catch(() => {
          if (formStatus) { formStatus.textContent = 'Network error. Please try again later.'; formStatus.style.color = 'crimson'; }
        }).finally(() => { if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ''; } });

      } else {
        // fallback to mailto when no endpoint is configured
        const mailto = `mailto:sudharanihadalagi@gmail.com?subject=${encodeURIComponent('Contact from ' + name)}&body=${encodeURIComponent(message + '\n\n' + email)}`;
        window.location.href = mailto;
        if (formStatus) formStatus.textContent = 'Opening your mail client...';
        contactForm.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ''; }
      }
    });
  }

  /* Mobile/desktop resize adjustments */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      document.getElementById('mobileMenu').setAttribute('aria-hidden','true');
    }
  });

  /* Scroll to top */
  document.getElementById('scrollTop').addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); });

  /* ensure external links open new tabs (defensive) */
  document.querySelectorAll('a[target="_blank"]').forEach(a => { a.rel = 'noopener'; });

});

/* small helper CSS animation class (fade-in) is inlined via JS class triggers; no further code */
