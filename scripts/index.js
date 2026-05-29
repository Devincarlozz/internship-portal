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

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeLabel) {
    themeLabel.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
  }
  
  const mobSun = document.querySelector('.sun-icon-mob');
  const mobMoon = document.querySelector('.moon-icon-mob');
  if (theme === 'dark') {
    if (mobSun) mobSun.classList.add('hidden');
    if (mobMoon) mobMoon.classList.remove('hidden');
  } else {
    if (mobSun) mobSun.classList.remove('hidden');
    if (mobMoon) mobMoon.classList.add('hidden');
  }
  
  try {
    localStorage.setItem('theme', theme);
  } catch (e) {}
}

document.addEventListener('DOMContentLoaded', () => {
  let theme = 'light';
  try {
    theme = localStorage.getItem('theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  } catch (e) {}
  applyTheme(theme);
});

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(targetTheme);
  });
}

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

const darkVideo = document.getElementById('bg-video-dark');
const lightVideo = document.getElementById('bg-video-light');
let targetScroll = window.scrollY;
let currentScroll = window.scrollY;
let scrolling = false;
const scrollEase = 0.085;

window.addEventListener('wheel', (e) => {
  if (window.innerWidth <= 768) return;
  const isTouchpad = (Math.abs(e.deltaY) < 50) || (e.deltaY % 1 !== 0);
  if (isTouchpad) return;
  e.preventDefault();
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  targetScroll = Math.min(Math.max(targetScroll + e.deltaY * 1.15, 0), maxScroll);
  if (!scrolling) {
    scrolling = true;
    requestAnimationFrame(scrollTick);
  }
}, { passive: false });

window.addEventListener('scroll', () => {
  if (!scrolling) {
    targetScroll = window.scrollY;
    currentScroll = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
    updateParallax(currentScroll / maxScroll);
  }
}, { passive: true });

function scrollTick() {
  const diff = targetScroll - currentScroll;
  if (Math.abs(diff) > 0.2) {
    currentScroll += diff * scrollEase;
    window.scrollTo(0, currentScroll);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
    updateParallax(currentScroll / maxScroll);
    requestAnimationFrame(scrollTick);
  } else {
    currentScroll = targetScroll;
    window.scrollTo(0, currentScroll);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
    updateParallax(currentScroll / maxScroll);
    scrolling = false;
  }
}

function updateParallax(percent) {
  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const opacity = 1.0 - Math.min(percent * 2.2, 0.75);
  const blur = Math.min(percent * 16, 6);
  const transform = `translateY(${percent * -8}%) scale(${1.08 + percent * 0.05})`;

  if (theme === 'dark') {
    if (darkVideo) {
      darkVideo.style.transform = transform;
      darkVideo.style.opacity = opacity;
      darkVideo.style.filter = `blur(${blur}px)`;
    }
  } else {
    if (lightVideo) {
      lightVideo.style.transform = transform;
      lightVideo.style.opacity = opacity;
      lightVideo.style.filter = `blur(${blur}px)`;
    }
  }
}

updateParallax(0);

function initPlayback() {
  const darkVideo = document.getElementById('bg-video-dark');
  const lightVideo = document.getElementById('bg-video-light');
  const check = (video) => {
    if (!video) return;
    video.play().then(() => {
      document.body.classList.remove('video-blocked');
    }).catch(() => {
      document.body.classList.add('video-blocked');
    });
  };
  check(darkVideo);
  check(lightVideo);
  document.addEventListener('click', () => {
    if (darkVideo && darkVideo.paused) {
      darkVideo.play().then(() => document.body.classList.remove('video-blocked')).catch(() => {});
    }
    if (lightVideo && lightVideo.paused) {
      lightVideo.play().then(() => document.body.classList.remove('video-blocked')).catch(() => {});
    }
  }, { once: true });
}

document.addEventListener('DOMContentLoaded', initPlayback);

const mobNav = document.querySelector('.mobile-bottom-nav');
const mobHome = document.getElementById('mobile-nav-home');
const mobJobs = document.getElementById('mobile-nav-jobs');
const mobTheme = document.getElementById('mobile-theme-toggle');
const mobSun = document.querySelector('.sun-icon-mob');
const mobMoon = document.querySelector('.moon-icon-mob');

if (window.innerWidth <= 768 && mobNav) {
  setTimeout(() => {
    mobNav.classList.add('nav-visible');
  }, 500);
}

window.addEventListener('scroll', () => {
  if (window.innerWidth > 768) return;
  if (mobHome) mobHome.classList.add('active');
  if (mobJobs) mobJobs.classList.remove('active');
}, { passive: true });

if (mobTheme) {
  mobTheme.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(targetTheme);
  });
}

// Intercept empty links for Feature Coming Soon toast
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a');
  if (anchor && (anchor.getAttribute('href') === '#' || anchor.getAttribute('href') === 'javascript:void(0)')) {
    e.preventDefault();
    showToast('Feature Coming Soon');
  }
});

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    </div>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  toast.offsetHeight; // trigger reflow
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => {
      toast.remove();
      if (container.children.length === 0) {
        container.remove();
      }
    });
  }, 3200);
}

// Hamburger Menu Toggle
const hamburgerBtn = document.getElementById('hamburger-btn');
const navLinks = document.querySelector('.nav-links');

if (hamburgerBtn && navLinks) {
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}
