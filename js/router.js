// js/router.js
// Client-Side Router für Single Page Application

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.currentView = null;
    this.history = [];
    this.init();
  }

  init() {
    // Popstate Event für Browser-Navigation (Zurück/Vor)
    window.addEventListener('popstate', (e) => {
      this.handleRoute(location.pathname, false);
    });

    // Intercept alle Link-Klicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (!link) return;
      
      const href = link.getAttribute('href');
      
      // Externe Links oder spezielle Links ignorieren
      if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Hash-Links ignorieren (für Anker)
      if (href.startsWith('#')) {
        return;
      }

      // Verhindere Standard-Navigation
      e.preventDefault();
      
      // Navigiere zur Route
      this.navigate(href);
    });

    // Initial Route wird von app.js geladen, nicht hier
    // (verhindert doppelte Initialisierung)
  }

  /**
   * Route registrieren
   * @param {string} path - Route-Pfad (z.B. '/', '/tagebuch', '/login')
   * @param {Function} viewFactory - Funktion die die View zurückgibt
   * @param {Object} options - Optionen (requiresAuth, title, etc.)
   */
  route(path, viewFactory, options = {}) {
    // Normalisiere Pfad
    const normalizedPath = this.normalizePath(path);
    this.routes.set(normalizedPath, { viewFactory, ...options });
  }

  /**
   * Pfad normalisieren
   */
  normalizePath(path) {
    // Entferne führende/trailing Slashes und .html
    return path
      .replace(/^\/+|\/+$/g, '')
      .replace(/\.html$/, '')
      .toLowerCase() || 'index';
  }

  /**
   * Navigation zu einer Route
   */
  async navigate(path, pushState = true) {
    const normalizedPath = this.normalizePath(path);
    
    // Push zu History (außer bei initial load)
    if (pushState) {
      window.history.pushState({ route: normalizedPath }, '', path);
    }

    await this.handleRoute(normalizedPath, pushState);
  }

  /**
   * Route verarbeiten
   */
  async handleRoute(path, animate = true) {
    const normalizedPath = this.normalizePath(path);
    
    // Finde Route
    const route = this.routes.get(normalizedPath);
    
    if (!route) {
      // 404 - Fallback zu index
      console.warn(`Route nicht gefunden: ${normalizedPath}, fallback zu index`);
      await this.handleRoute('index', animate);
      return;
    }

    // Auth-Check
    if (route.requiresAuth) {
      const { requireUser } = await import('./check-auth.js');
      try {
        await requireUser();
      } catch (error) {
        // Nicht eingeloggt, redirect zu login
        await this.navigate('login.html', false);
        return;
      }
    }

    // Alte View entfernen (mit Animation)
    if (this.currentView && animate) {
      await this.fadeOut(this.currentView);
    }

    // Neue View erstellen
    const viewContainer = document.getElementById('app-view');
    if (!viewContainer) {
      console.error('App-Container nicht gefunden!');
      return;
    }

    // View-Container leeren
    if (!animate) {
      viewContainer.innerHTML = '';
    }

    // View erstellen
    try {
      const view = await route.viewFactory();
      
      // View in Container einfügen
      if (animate) {
        viewContainer.innerHTML = view;
        await this.fadeIn(viewContainer);
      } else {
        viewContainer.innerHTML = view;
      }

      // Title aktualisieren
      if (route.title) {
        document.title = route.title;
      }

      // Route als aktuell markieren
      this.currentRoute = normalizedPath;
      this.currentView = viewContainer;

      // Navigation aktualisieren (active states)
      this.updateNavigation();
      
      // Navigation neu rendern (falls sich Auth-Status geändert hat)
      // Nur wenn Navigation bereits gerendert wurde
      if (document.querySelector('nav')) {
        try {
          const { renderNav } = await import('./nav.js');
          await renderNav();
        } catch (err) {
          console.warn('Navigation konnte nicht aktualisiert werden:', err);
        }
      }

      // Scroll nach oben
      window.scrollTo({ top: 0, behavior: animate ? 'smooth' : 'auto' });

    } catch (error) {
      console.error('Fehler beim Laden der View:', error);
      viewContainer.innerHTML = `
        <div class="error-container">
          <h2>Fehler beim Laden</h2>
          <p>Die Seite konnte nicht geladen werden.</p>
          <a href="index.html" class="btn btn-primary">Zur Startseite</a>
        </div>
      `;
    }
  }

  /**
   * Fade-Out Animation
   */
  fadeOut(element) {
    return new Promise((resolve) => {
      element.style.opacity = '0';
      element.style.transition = 'opacity 0.2s ease-out';
      setTimeout(() => {
        resolve();
      }, 200);
    });
  }

  /**
   * Fade-In Animation
   */
  fadeIn(element) {
    return new Promise((resolve) => {
      element.style.opacity = '0';
      element.style.transition = 'opacity 0.2s ease-in';
      // Force reflow
      element.offsetHeight;
      element.style.opacity = '1';
      setTimeout(() => {
        resolve();
      }, 200);
    });
  }

  /**
   * Navigation aktualisieren (active states)
   */
  updateNavigation() {
    const navLinks = document.querySelectorAll('nav a[href]');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const linkPath = this.normalizePath(href);
      
      if (linkPath === this.currentRoute) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }
}

// Singleton Router-Instanz
export const router = new Router();

