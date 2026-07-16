/**
 * リストランテ・森ノ庭 福島 — Demo LP
 * Small, dependency-free interactions: header scroll state,
 * mobile nav, scroll-reveal, and the reservation form's
 * (submission-less) confirmation summary.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScrollState();
  initMobileNav();
  initScrollReveal();
  initReserveForm();
});

/** Adds a shadow to the fixed header once the page has scrolled. */
function initHeaderScrollState() {
  const header = document.getElementById('siteHeader');

  const updateScrolledState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  updateScrolledState();
  window.addEventListener('scroll', updateScrolledState, { passive: true });
}

/** Wires the hamburger button to the full-screen mobile nav overlay. */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('mobileNavOverlay');

  const closeNav = () => {
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = overlay.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  overlay.querySelectorAll('.mobile-nav-link, .mobile-nav-cta').forEach((link) => {
    link.addEventListener('click', closeNav);
  });
}

/** Fades/slides `.reveal` elements in the first time they enter the viewport. */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/**
 * The reserve form is a demo: instead of submitting anywhere, it
 * renders a plain-text summary of what was entered so the flow
 * still feels complete end-to-end.
 */
function initReserveForm() {
  const form = document.getElementById('reserveForm');
  const confirmBox = document.getElementById('reserveConfirm');
  const confirmBody = document.getElementById('reserveConfirmBody');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    confirmBody.textContent = buildReservationSummary(new FormData(form));
    confirmBox.hidden = false;
    confirmBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

/** @param {FormData} data @returns {string} human-readable reservation summary */
function buildReservationSummary(data) {
  return [
    `ご希望日：${data.get('date')}`,
    `人数：${data.get('guests')}`,
    `時間帯：${data.get('time')}`,
    `コース：${data.get('course')}`,
    `お名前：${data.get('name')} 様`,
    `電話番号：${data.get('tel')}`,
    `メールアドレス：${data.get('email')}`,
    `ご要望：${data.get('request') || 'なし'}`,
  ].join('\n');
}
