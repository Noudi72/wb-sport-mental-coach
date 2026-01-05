// js/app.js
// Haupt-App-Initialisierung für SPA

import { router } from './router.js';
import { renderHomeView } from './views/home-view.js';
import { renderTagebuchView } from './views/tagebuch-view.js';
import { renderFragebogenView } from './views/fragebogen-view.js';
import { renderAudioView } from './views/audio-view.js';
import { renderFeedbackView } from './views/feedback-view.js';
import { renderContactView } from './views/contact-view.js';
import { renderLoginView } from './views/login-view.js';
import { renderAdminView } from './views/admin-view.js';

// View-Initialisierer (laden die JavaScript-Logik für jede View)
const viewInitializers = {
  tagebuch: async () => {
    const { initTagebuch } = await import('./tagebuch.js');
    return initTagebuch;
  },
  frageboegen: async () => {
    // Chart.js muss geladen sein
    if (typeof Chart === 'undefined') {
      await loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js');
    }
    const { initFragebogen } = await import('./fragebogen.js');
    return initFragebogen;
  },
  hoerbuch: async () => {
    const { initAudio } = await import('./audio.js');
    return initAudio;
  },
  feedback: async () => {
    const { initFeedback } = await import('./feedback.js');
    return initFeedback;
  },
  contact: async () => {
    const { initContact } = await import('./contact.js');
    return initContact;
  },
  login: async () => {
    const { initLogin } = await import('./login.js');
    return initLogin;
  },
  admin: async () => {
    const { initAdmin } = await import('./admin.js');
    return initAdmin;
  }
};

// Script dynamisch laden
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Routes registrieren
function registerRoutes() {
  // Home
  router.route('/', renderHomeView, { title: 'WB Sport Mental Coach' });
  router.route('/index.html', renderHomeView, { title: 'WB Sport Mental Coach' });
  router.route('index', renderHomeView, { title: 'WB Sport Mental Coach' });

  // Tagebuch
  router.route('/tagebuch.html', async () => {
    const html = await renderTagebuchView();
    const init = await viewInitializers.tagebuch();
    setTimeout(() => init?.(), 0);
    return html;
  }, { title: 'Tagebuch – WB Mental Coach', requiresAuth: true });

  router.route('tagebuch', async () => {
    const html = await renderTagebuchView();
    const init = await viewInitializers.tagebuch();
    setTimeout(() => init?.(), 0);
    return html;
  }, { title: 'Tagebuch – WB Mental Coach', requiresAuth: true });

  // Mental-Check-in
  router.route('/frageboegen.html', async () => {
    const html = await renderFragebogenView();
    const init = await viewInitializers.frageboegen();
    setTimeout(() => init?.(), 0);
    return html;
  }, { title: 'Mental-Check-in – WB Mental Coach', requiresAuth: true });

  router.route('frageboegen', async () => {
    const html = await renderFragebogenView();
    const init = await viewInitializers.frageboegen();
    setTimeout(() => init?.(), 0);
    return html;
  }, { title: 'Mental-Check-in – WB Mental Coach', requiresAuth: true });

  // Audio
  router.route('/hoerbuch.html', async () => {
    const html = await renderAudioView();
    const init = await viewInitializers.hoerbuch();
    setTimeout(() => init?.(), 0);
    return html;
  }, { title: 'Hörbücher & Meditationen – WB Mental Coach', requiresAuth: true });

  router.route('hoerbuch', async () => {
    const html = await renderAudioView();
    const init = await viewInitializers.hoerbuch();
    setTimeout(() => init?.(), 0);
    return html;
  }, { title: 'Hörbücher & Meditationen – WB Mental Coach', requiresAuth: true });

  // Feedback
  router.route('/feedback.html', async () => {
    const html = await renderFeedbackView();
    const init = await viewInitializers.feedback();
    setTimeout(() => init?.(), 0);
    return html;
  }, { title: 'Feedback – WB Sport Mental Coach' });

  router.route('feedback', async () => {
    const html = await renderFeedbackView();
    const init = await viewInitializers.feedback();
    setTimeout(() => init?.(), 0);
    return html;
  }, { title: 'Feedback – WB Sport Mental Coach' });

  // Kontakt
  router.route('/contact.html', async () => {
    const html = await renderContactView();
    const init = await viewInitializers.contact();
    setTimeout(() => init?.(), 0);
    return html;
  }, { title: 'Kontakt – WB Mental Coach' });

  router.route('contact', async () => {
    const html = await renderContactView();
    const init = await viewInitializers.contact();
    setTimeout(() => init?.(), 0);
    return html;
  }, { title: 'Kontakt – WB Mental Coach' });

  // Login
  router.route('/login.html', async () => {
    const html = await renderLoginView();
    const init = await viewInitializers.login();
    setTimeout(() => init?.(), 0);
    return html;
  }, { title: 'Login – WB SportMental Coach' });

  router.route('login', async () => {
    const html = await renderLoginView();
    const init = await viewInitializers.login();
    setTimeout(() => init?.(), 0);
    return html;
  }, { title: 'Login – WB SportMental Coach' });

  // Admin
  router.route('/admin.html', async () => {
    const html = await renderAdminView();
    const init = await viewInitializers.admin();
    setTimeout(() => init?.(), 0);
    return html;
  }, { title: 'Admin – Ergebnisse aller Klienten', requiresAuth: true });

  router.route('admin', async () => {
    const html = await renderAdminView();
    const init = await viewInitializers.admin();
    setTimeout(() => init?.(), 0);
    return html;
  }, { title: 'Admin – Ergebnisse aller Klienten', requiresAuth: true });
}

// App initialisieren
export async function initApp() {
  // Routes registrieren
  registerRoutes();
  
  console.log('✅ SPA Router initialisiert');
  
  // Sicherstellen, dass die initiale Route geladen wird
  // Warte kurz, damit DOM vollständig bereit ist
  await new Promise(resolve => setTimeout(resolve, 10));
  
  // Lade initiale Route
  // Auf GitHub Pages ist der Pfad z.B. /wb-sport-mental-coach/ oder /wb-sport-mental-coach/index.html
  let currentPath = location.pathname || 'index.html';
  
  // Entferne Repository-Pfad für GitHub Pages
  // z.B. /wb-sport-mental-coach/index.html -> index.html
  if (currentPath.includes('/') && currentPath !== '/') {
    const parts = currentPath.split('/').filter(p => p);
    currentPath = parts[parts.length - 1] || 'index.html';
  }
  
  // Wenn leer oder nur /, dann index.html
  if (!currentPath || currentPath === '/' || currentPath === 'index.html' || currentPath.endsWith('/')) {
    currentPath = 'index.html';
  }
  
  const hash = location.hash.replace('#', '');
  const pathToLoad = hash || currentPath;
  
  console.log('📍 Lade initiale Route:', pathToLoad, '(von', location.pathname, ')');
  await router.handleRoute(pathToLoad, false);
}

// Auto-Init wird von index.html gesteuert, nicht hier

