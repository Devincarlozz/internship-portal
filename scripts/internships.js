document.addEventListener('DOMContentLoaded', () => {
  const title = document.getElementById('hero-title');
  if (title) {
    const words = title.textContent.trim().split(/\s+/);
    title.innerHTML = '';
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word;
      span.className = 'word-fade';
      span.style.setProperty('--word-index', index);
      title.appendChild(span);
      if (index < words.length - 1) {
        title.appendChild(document.createTextNode(' '));
      }
    });
  }
});

window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 40) {
      navbar.classList.add('nav-scrolled');
    } else {
      navbar.classList.remove('nav-scrolled');
    }
  }
});

const themeBtn = document.getElementById('theme-toggle-btn');
const themeLabel = document.getElementById('theme-text-label');

document.addEventListener('DOMContentLoaded', () => {
  let theme = 'light';
  try {
    theme = localStorage.getItem('theme') || 'light';
  } catch (e) {}
  if (themeLabel) {
    themeLabel.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
  }
});

themeBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', targetTheme);
  try {
    localStorage.setItem('theme', targetTheme);
  } catch (e) {}
  if (themeLabel) {
    themeLabel.textContent = targetTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
  }
});

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      obs.unobserve(entry.target);
    }
  });
}, {
  root: null,
  rootMargin: '0px -5% -10% 0px',
  threshold: 0.1
});

document.querySelectorAll('.scroll-reveal').forEach(title => {
  observer.observe(title);
});

const cardsObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      card.style.setProperty('will-change', 'transform, opacity');
      card.classList.add('revealed');
      obs.unobserve(card);
      card.addEventListener('animationend', () => {
        card.style.removeProperty('will-change');
      }, { once: true });
    }
  });
}, {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
});

function setupCards() {
  let tappedCard = null;

  function collapseTapped() {
    if (tappedCard) {
      tappedCard.classList.remove('tapped');
      tappedCard = null;
    }
  }

  document.querySelectorAll('.internship-card').forEach((card, index) => {
    card.style.setProperty('--delay', index);
    cardsObserver.observe(card);
    card.onmousemove = null;

    // Spotlight cursor effect (desktop)
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });

    // Click/tap to expand — works on both mobile and desktop
    // On desktop: hover CSS takes priority visually; tap is a bonus toggle
    // On mobile: this is the primary expand mechanism
    card.addEventListener('click', (e) => {
      if (e.target.closest('.apply-btn')) return;

      if (card.classList.contains('tapped')) {
        collapseTapped();
      } else {
        collapseTapped();
        card.classList.add('tapped');
        tappedCard = card;
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', setupCards);

const searchInput = document.getElementById('search-input');
const filterTabs = document.querySelectorAll('.filter-tab');
const sortSelect = document.getElementById('sort-select');
const cardsGrid = document.querySelector('.listings-grid');
const cards = Array.from(document.querySelectorAll('.internship-card'));

let query = '';
let category = 'all';
let sortBy = 'default';

function filterCards() {
  let visible = cards.filter(card => {
    const badge = card.querySelector('.card-badge').textContent.toLowerCase();
    let matchCat = category === 'all' || category === badge;

    const title = card.querySelector('.role-title').textContent.toLowerCase();
    const company = card.querySelector('.company-name').textContent.toLowerCase();
    const desc = card.querySelector('.role-description').textContent.toLowerCase();
    const eligibilityEl = card.querySelector('.info-row:nth-child(1) .info-value');
    const eligibility = eligibilityEl ? eligibilityEl.textContent.toLowerCase() : '';
    const matchSearch = title.includes(query) || company.includes(query) || desc.includes(query) || eligibility.includes(query);

    return matchCat && matchSearch;
  });

  cards.forEach(card => {
    card.classList.remove('revealed');
    card.style.display = 'none';
    cardsObserver.unobserve(card);
  });

  if (sortBy === 'deadline') {
    visible.sort((a, b) => new Date(a.dataset.deadline) - new Date(b.dataset.deadline));
  } else if (sortBy === 'active') {
    visible.sort((a, b) => parseInt(b.dataset.active) - parseInt(a.dataset.active));
  } else {
    visible.sort((a, b) => parseInt(a.dataset.id) - parseInt(b.dataset.id));
  }

  visible.forEach((card, index) => {
    card.style.display = 'flex';
    card.style.setProperty('--delay', index);
    cardsGrid.appendChild(card);
    cardsObserver.observe(card);
  });

  const emptyState = document.getElementById('empty-state');
  if (emptyState) {
    emptyState.style.display = visible.length === 0 ? 'flex' : 'none';
  }
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    query = e.target.value.toLowerCase().trim();
    filterCards();
  });
}

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    category = tab.dataset.category;
    filterCards();
  });
});

if (sortSelect) {
  sortSelect.addEventListener('change', (e) => {
    sortBy = e.target.value;
    filterCards();
  });
}

const modal = document.getElementById('apply-modal');
const modalCompany = document.getElementById('modal-company-name');
const modalRole = document.getElementById('modal-role-title');
const form = document.getElementById('application-form');
const formBox = document.getElementById('modal-form-container');
const successBox = document.getElementById('modal-success-container');
const successName = document.getElementById('success-name');
const successRole = document.getElementById('success-role');
const successCompany = document.getElementById('success-company');

let activeCompany = '';
let activeRole = '';

function openApplyModal(company, role, id) {
  activeCompany = company;
  activeRole = role;
  if (modalCompany) modalCompany.textContent = company;
  if (modalRole) modalRole.textContent = role;

  if (formBox) formBox.classList.remove('hidden');
  if (successBox) successBox.classList.add('hidden');
  if (form) form.reset();

  const card = document.querySelector(`.internship-card[data-id="${id}"]`);
  if (card && modal) {
    const color = getComputedStyle(card).getPropertyValue('--card-accent').trim();
    const rgb = getComputedStyle(card).getPropertyValue('--card-accent-rgb').trim();
    modal.style.setProperty('--accent-color', color);
    modal.style.setProperty('--accent-rgb', rgb);
  }

  updateSubmitState();
  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeApplyModal() {
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function handleOverlayClick(e) {
  if (e.target === modal) {
    closeApplyModal();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeApplyModal();
  }
});

function handleFormSubmit(e) {
  e.preventDefault();
  const nameInput = document.getElementById('applicant-name');
  const name = nameInput ? nameInput.value.trim() : '';
  const submitBtn = document.getElementById('modal-submit-btn');

  const sName = document.getElementById('success-name');
  const sRole = document.getElementById('success-role');
  const sCompany = document.getElementById('success-company');
  const fBox = document.getElementById('modal-form-container');
  const sBox = document.getElementById('modal-success-container');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="2" x2="12" y2="6"/>
        <line x1="12" y1="18" x2="12" y2="22"/>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
        <line x1="2" y1="12" x2="6" y2="12"/>
        <line x1="18" y1="12" x2="22" y2="12"/>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
      </svg>
      <span>Submitting Application...</span>
    `;
  }

  setTimeout(() => {
    if (sName) sName.textContent = name;
    if (sRole) sRole.textContent = activeRole;
    if (sCompany) sCompany.textContent = activeCompany;

    if (fBox) fBox.classList.add('hidden');
    if (sBox) sBox.classList.remove('hidden');

    setTimeout(() => {
      closeApplyModal();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Submit Application</span>`;
      }
    }, 2800);
  }, 1400);
}

window.openApplyModal = openApplyModal;
window.closeApplyModal = closeApplyModal;
window.handleOverlayClick = handleOverlayClick;
window.handleFormSubmit = handleFormSubmit;

const orbWrappers = Array.from(document.querySelectorAll('.orb-scroll-wrapper'));

let lastScrollTime = Date.now();
let lastScrollY = window.scrollY;
let nativeTimeout;
let tickPending = false;
let scrollStopTimeout;

window.addEventListener('scroll', () => {
  const currentY = window.scrollY;
  if (currentY === lastScrollY) return;

  // is-scrolling only needed on desktop to suppress hover during scroll
  if (window.innerWidth > 768) {
    document.body.classList.add('is-scrolling');
    clearTimeout(scrollStopTimeout);
    scrollStopTimeout = setTimeout(() => {
      document.body.classList.remove('is-scrolling');
      document.body.classList.remove('fast-scrolling');
    }, 150);
  }

  if (!tickPending) {
    tickPending = true;
    requestAnimationFrame(() => {
      const now = Date.now();
      const dt = Math.max(now - lastScrollTime, 1);
      const dy = window.scrollY - lastScrollY;
      lastScrollTime = now;
      lastScrollY = window.scrollY;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
      updateParallax(window.scrollY / maxScroll);
      updateStack((dy / dt) * 6);

      clearTimeout(nativeTimeout);
      nativeTimeout = setTimeout(() => updateStack(0), 80);
      tickPending = false;
    });
  }
}, { passive: true });

function updateStack(velocity) {
  const clamp = Math.max(Math.min(velocity, 25), -25);
  const abs = Math.abs(clamp);

  // fast-scrolling blur effect only on desktop — mobile scroll
  // fires rapid deltas that cause visible flicker on entering tiles
  if (window.innerWidth > 768) {
    if (abs > 1.2) {
      document.body.classList.add('fast-scrolling');
    } else if (abs < 0.3) {
      document.body.classList.remove('fast-scrolling');
    }
  } else {
    document.body.classList.remove('fast-scrolling');
  }

  cards.forEach(card => {
    card.style.setProperty('--scroll-velocity', clamp);
    card.style.setProperty('--scroll-velocity-abs', abs);
  });
}

function updateParallax(percent) {
  const opacity = 1.0 - Math.min(percent * 1.5, 0.6);
  const blur = Math.min(percent * 10, 4);
  const transform = `translateY(${percent * -15}%)`;
  orbWrappers.forEach(wrapper => {
    wrapper.style.transform = transform;
    wrapper.style.opacity = opacity;
    wrapper.style.filter = `blur(${blur}px)`;
  });
}

updateParallax(0);

const mobNav = document.querySelector('.mobile-bottom-nav');
const mobTheme = document.getElementById('mobile-theme-toggle');
const mobSun = document.querySelector('.sun-icon-mob');
const mobMoon = document.querySelector('.moon-icon-mob');

if (window.innerWidth <= 768 && mobNav) {
  setTimeout(() => mobNav.classList.add('nav-visible'), 500);
}

document.addEventListener('DOMContentLoaded', () => {
  let theme = 'light';
  try {
    theme = document.documentElement.getAttribute('data-theme') || 'light';
  } catch (e) {}

  if (theme === 'dark') {
    if (mobSun) mobSun.classList.add('hidden');
    if (mobMoon) mobMoon.classList.remove('hidden');
  } else {
    if (mobSun) mobSun.classList.remove('hidden');
    if (mobMoon) mobMoon.classList.add('hidden');
  }

  const appForm = document.getElementById('application-form');
  if (appForm) {
    appForm.querySelectorAll('.input-field').forEach(input => {
      input.addEventListener('input', updateSubmitState);
    });
  }
});

function updateSubmitState() {
  const submitBtn = document.getElementById('modal-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = false;
  }
}
window.updateSubmitState = updateSubmitState;

if (mobTheme) {
  mobTheme.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', targetTheme);
    try {
      localStorage.setItem('theme', targetTheme);
    } catch (e) {}

    const themeLabel = document.getElementById('theme-text-label');
    if (themeLabel) {
      themeLabel.textContent = targetTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
    }

    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    if (targetTheme === 'dark') {
      if (sunIcon) sunIcon.classList.add('hidden');
      if (moonIcon) moonIcon.classList.remove('hidden');
      if (mobSun) mobSun.classList.add('hidden');
      if (mobMoon) mobMoon.classList.remove('hidden');
    } else {
      if (sunIcon) sunIcon.classList.remove('hidden');
      if (moonIcon) moonIcon.classList.add('hidden');
      if (mobSun) mobSun.classList.remove('hidden');
      if (mobMoon) mobMoon.classList.add('hidden');
    }
  });
}
