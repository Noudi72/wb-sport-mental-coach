// js/nav.js
import { supabase } from './supa.js';
import { ADMIN_EMAIL } from './check-auth.js';
import { createDarkModeToggle } from './dark-mode.js';

const LINKS = [
  { label: 'Home', href: 'index.html' },
  { label: 'Hörbücher & Meditationen', href: 'hoerbuch.html' },
  { label: 'Mental-Check-in', href: 'frageboegen.html' },
  { label: 'Feedback', href: 'feedback.html' },
  { label: 'Tagebuch', href: 'tagebuch.html' },
  { label: 'Kontakt', href: 'contact.html' },
];

function isActive(href) {
  const current = location.pathname.split('/').pop() || 'index.html';
  return current === href;
}

// buildMainLinks und buildAuthLinks werden nicht mehr direkt verwendet,
// sondern sind jetzt in buildNavHtml integriert

function buildThemeToggle() {
  return '<span id="themeToggleContainer"></span>';
}

function buildNavHtml(user) {
  const mainLinks = LINKS.map(link => {
    const active = isActive(link.href);
    return `<li><a href="${link.href}"${active ? ' class="active" aria-current="page"' : ''}>${link.label}</a></li>`;
  }).join('');

  let authLinks = '';
  if (user?.email === ADMIN_EMAIL) {
    const activeAdmin = isActive('admin.html');
    authLinks += `<li><a href="admin.html"${activeAdmin ? ' class="active" aria-current="page"' : ''}>Admin</a></li>`;
  }

  const activeLogin = isActive('login.html');
  if (user) {
    authLinks += `<li><button id="logoutBtn" class="auth-link" type="button">Logout</button></li>`;
  } else {
    authLinks += `<li><a href="login.html"${activeLogin ? ' class="active auth-link" aria-current="page"' : ' class="auth-link"'}>Login</a></li>`;
  }

  return `<ul class="nav-list">${mainLinks}${authLinks}</ul>${buildThemeToggle()}`;
}

function createMobileToggle() {
  const toggle = document.createElement('button');
  toggle.className = 'navbar-toggle';
  toggle.setAttribute('aria-label', 'Menü öffnen/schließen');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('type', 'button');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const nav = document.querySelector('nav');
    const isOpen = nav.classList.contains('mobile-open');
    nav.classList.toggle('mobile-open', !isOpen);
    toggle.classList.toggle('active', !isOpen);
    toggle.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    
    // Verhindere Body-Scroll wenn Menü offen ist
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  return toggle;
}

async function renderNav() {
  const nav = document.querySelector('nav');
  const navbar = document.querySelector('.navbar');
  if (!nav || !navbar) return;

  const { data: { user } } = await supabase.auth.getUser();

  nav.innerHTML = buildNavHtml(user);

  const btn = nav.querySelector('#logoutBtn');
  if (btn) {
    btn.addEventListener('click', async () => {
      await supabase.auth.signOut();
      // Router verwenden für Navigation
      const { router } = await import('./router.js');
      router.navigate('index.html', false);
    });
  }

  // Dark Mode Toggle hinzufügen
  const toggleContainer = nav.querySelector('#themeToggleContainer');
  if (toggleContainer) {
    const toggle = createDarkModeToggle();
    toggleContainer.appendChild(toggle);
  }

  // Mobile Toggle Button hinzufügen (nur wenn nicht vorhanden)
  if (!navbar.querySelector('.navbar-toggle')) {
    const mobileToggle = createMobileToggle();
    navbar.appendChild(mobileToggle);
  }

  // Schließe Mobile-Menü bei Klick auf Nav-Link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        nav.classList.remove('mobile-open');
        const toggle = navbar.querySelector('.navbar-toggle');
        if (toggle) {
          toggle.classList.remove('active');
          toggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
      }
    });
  });

  // Schließe Mobile-Menü bei Klick außerhalb
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 768 && !navbar.contains(e.target) && nav.classList.contains('mobile-open')) {
      nav.classList.remove('mobile-open');
      const toggle = navbar.querySelector('.navbar-toggle');
      if (toggle) {
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }
  });

  // Schließe Mobile-Menü bei Resize zu Desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && nav.classList.contains('mobile-open')) {
      nav.classList.remove('mobile-open');
      const toggle = navbar.querySelector('.navbar-toggle');
      if (toggle) {
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }
  });
}

// Export für manuelles Rendering
export { renderNav };

// Auto-Render wenn DOM bereit ist (nur wenn nicht bereits gerendert)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderNav);
} else {
  // DOM bereits bereit, sofort rendern
  renderNav();
}

// Re-render bei Auth-Änderungen
supabase.auth.onAuthStateChange(() => renderNav());