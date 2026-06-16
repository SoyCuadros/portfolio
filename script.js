/**
 * Daniel Cuadros Gaona — Portfolio
 * Interacciones: Typing, Intersection Observer, Navbar, Formulario
 */

(function () {
  'use strict';

  const CONTACT_EMAIL = 'danielcuadros480@gmail.com';

  /* ── Typing Effect ── */
  const TITLES = [
    'Full-Stack Developer',
    'AI & Big Data Specialist',
    'DAW Graduate'
  ];

  const typingEl = document.getElementById('typingText');
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  function typeEffect() {
    if (!typingEl) return;

    const current = TITLES[titleIndex];

    if (isDeleting) {
      typingEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      delay = 2200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % TITLES.length;
      delay = 500;
    }

    typingTimeout = setTimeout(typeEffect, delay);
  }

  if (typingEl) {
    typeEffect();
  }

  /* ── Intersection Observer — Reveal on Scroll ── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ── Navbar: Scroll + Active Section ── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleNavbarScroll() {
    if (!navbar) return;
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 50);
  }

  function setActiveNavLink() {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('nav-link--active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav-link--active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    setActiveNavLink();
  }, { passive: true });

  handleNavbarScroll();

  /* ── Mobile Nav Toggle ── */
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('navbar__links--open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinksContainer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('navbar__links--open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── Smooth anchor close on outside click ── */
  document.addEventListener('click', (e) => {
    if (
      navLinksContainer &&
      navToggle &&
      !navLinksContainer.contains(e.target) &&
      !navToggle.contains(e.target)
    ) {
      navLinksContainer.classList.remove('navbar__links--open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── Project Cards — Spotlight que sigue al cursor ── */
  document.querySelectorAll('.project-card').forEach((card) => {
    const inner = card.querySelector('.project-card__inner');
    const spotlight = card.querySelector('.project-card__spotlight');

    if (!inner || !spotlight) return;

    card.addEventListener('mouseenter', () => {
      card.classList.add('is-hovering');
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-hovering');
      spotlight.style.removeProperty('--mouse-x');
      spotlight.style.removeProperty('--mouse-y');
    });

    card.addEventListener('mousemove', (e) => {
      const rect = inner.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      spotlight.style.setProperty('--mouse-x', `${x}px`);
      spotlight.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('focusin', () => card.classList.add('is-hovering'));
    card.addEventListener('focusout', () => card.classList.remove('is-hovering'));
  });

  /* ── Contact Form Validation & Submit ── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  const validators = {
    name: {
      el: document.getElementById('name'),
      error: document.getElementById('nameError'),
      validate(value) {
        if (!value.trim()) return 'El nombre es obligatorio.';
        if (value.trim().length < 2) return 'Mínimo 2 caracteres.';
        return '';
      }
    },
    email: {
      el: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate(value) {
        if (!value.trim()) return 'El email es obligatorio.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Introduce un email válido.';
        return '';
      }
    },
    subject: {
      el: document.getElementById('subject'),
      error: document.getElementById('subjectError'),
      validate(value) {
        if (!value.trim()) return 'El asunto es obligatorio.';
        if (value.trim().length < 3) return 'Mínimo 3 caracteres.';
        return '';
      }
    },
    message: {
      el: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate(value) {
        if (!value.trim()) return 'El mensaje es obligatorio.';
        if (value.trim().length < 10) return 'Mínimo 10 caracteres.';
        return '';
      }
    }
  };

  function validateField(key) {
    const field = validators[key];
    const msg = field.validate(field.el.value);
    field.error.textContent = msg;
    return !msg;
  }

  Object.keys(validators).forEach((key) => {
    const field = validators[key];
    field.el.addEventListener('blur', () => validateField(key));
    field.el.addEventListener('input', () => {
      if (field.error.textContent) validateField(key);
    });
  });

  function hideFormMessages() {
    if (formSuccess) formSuccess.hidden = true;
  }

  function sendViaMailto(formData) {
    const subject = encodeURIComponent(formData.get('subject'));
    const body = encodeURIComponent(
      `Nombre: ${formData.get('name')}\nEmail: ${formData.get('email')}\n\n${formData.get('message')}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      hideFormMessages();

      const results = Object.keys(validators).map((key) => validateField(key));
      const isValid = results.every(Boolean);

      if (!isValid) return;

      sendViaMailto(new FormData(contactForm));

      if (formSuccess) formSuccess.hidden = false;
      contactForm.reset();
      Object.values(validators).forEach((f) => { f.error.textContent = ''; });

      setTimeout(hideFormMessages, 6000);
    });
  }

  /* ── Footer Year ── */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ── Cleanup on page unload ── */
  window.addEventListener('beforeunload', () => {
    clearTimeout(typingTimeout);
  });
})();
