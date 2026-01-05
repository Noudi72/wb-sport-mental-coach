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

function buildMainLinks() {
  return LINKS.map(link =>
    `<a href="${link.href}"${isActive(link.href) ? ' class="active" aria-current="page"' : ''}>${link.label}</a>`
  ).join('');
}

function buildAuthLinks(user) {
  let html = '';

  if (user?.email === ADMIN_EMAIL) {
    html += `<a href="admin.html"${isActive('admin.html') ? ' class="active" aria-current="page"' : ''}>Admin</a>`;
  }

  html += user
    ? `<button id="logoutBtn" class="auth-link" type="button">Logout</button>`
    : `<a href="login.html"${isActive('login.html') ? ' class="active auth-link" aria-current="page"' : ' class="auth-link"'}>Login</a>`;

  return html;
}

function buildThemeToggle() {
  return '<span id="themeToggleContainer"></span>';
}

function buildNavHtml(user) {
  return buildMainLinks() + buildAuthLinks(user) + buildThemeToggle();
}

function createMobileToggle() {
  const toggle = document.createElement('button');
  toggle.className = 'navbar-toggle';
  toggle.setAttribute('aria-label', 'Menü öffnen/schließen');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  
  toggle.addEventListener('click', () => {
    const nav = document.querySelector('nav');
    const isOpen = nav.classList.contains('mobile-open');
    nav.classList.toggle('mobile-open', !isOpen);
    toggle.classList.toggle('active', !isOpen);
    toggle.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
  });
  
  return toggle;
}

async function renderNav() {
  const nav = document.querySelector('nav');
  const navbar = document.querySelector('.navbar');
  if (!nav || !navbar) return;

  const { data: { user } } = await supabase.auth.getUser();

  // Erstelle Navigation mit Links als Liste
  const navHtml = `<ul class="nav-list">${buildMainLinks().split('</a>').map(link => {
    if (link.trim()) {
      const hrefMatch = link.match(/href="([^"]+)"/);
      const classMatch = link.match(/class="([^"]+)"/);
      const textMatch = link.match(/>([^<]+)</);
      if (hrefMatch && textMatch) {
        const href = hrefMatch[1];
        const text = textMatch[1];
        const classes = classMatch ? ` class="${classMatch[1]}"` : '';
        return `<li><a href="${href}"${classes}>${text}</a></li>`;
      }
    }
    return '';
  }).filter(Boolean).join('')}${buildAuthLinks(user).split('</a>').map(link => {
    if (link.includes('</button>')) {
      const btnMatch = link.match(/<button[^>]*>([^<]+)</);
      if (btnMatch) {
        return `<li>${link}</button></li>`;
      }
    } else if (link.trim()) {
      const hrefMatch = link.match(/href="([^"]+)"/);
      const classMatch = link.match(/class="([^"]+)"/);
      const textMatch = link.match(/>([^<]+)</);
      if (hrefMatch && textMatch) {
        const href = hrefMatch[1];
        const text = textMatch[1];
        const classes = classMatch ? ` class="${classMatch[1]}"` : '';
        return `<li><a href="${href}"${classes}>${text}</a></li>`;
      }
    }
    return '';
  }).filter(Boolean).join('')}</ul>${buildThemeToggle()}`;
  
  nav.innerHTML = navHtml;

  const btn = nav.querySelector('#logoutBtn');
  if (btn) {
    btn.addEventListener('click', async () => {
      await supabase.auth.signOut();
      location.href = 'index.html';
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
    navbar.insertBefore(mobileToggle, navbar.firstChild);
  }

  // Schließe Mobile-Menü bei Klick außerhalb
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && nav.classList.contains('mobile-open')) {
      nav.classList.remove('mobile-open');
      const toggle = navbar.querySelector('.navbar-toggle');
      if (toggle) {
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', renderNav);
supabase.auth.onAuthStateChange(() => renderNav());