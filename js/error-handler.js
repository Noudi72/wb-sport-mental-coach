// js/error-handler.js
// Globaler Error-Handler für die App

/**
 * Zeigt eine benutzerfreundliche Fehlermeldung an
 * @param {Error|string} error - Der Fehler oder Fehlermeldung
 * @param {HTMLElement|null} targetElement - Optional: Element für die Meldung
 */
let flashFunction = null;

// Lade Flash-Funktion asynchron
import('./utils.js').then((module) => {
  flashFunction = module.flash;
}).catch(() => {
  console.warn('Flash-Funktion konnte nicht geladen werden');
});

export function handleError(error, targetElement = null) {
  const message = error instanceof Error ? error.message : String(error);
  console.error('App Error:', error);

  // Versuche Flash-Message zu zeigen, falls verfügbar
  if (flashFunction) {
    const msgEl = targetElement || document.getElementById('msg');
    if (msgEl) {
      flashFunction(getUserFriendlyMessage(message), 'err', msgEl, 5000);
    }
  }
}

/**
 * Wandelt technische Fehlermeldungen in benutzerfreundliche um
 * @param {string} message
 * @returns {string}
 */
function getUserFriendlyMessage(message) {
  const friendlyMessages = {
    'Invalid login credentials': 'Ungültige Anmeldedaten. Bitte überprüfe E-Mail und Passwort.',
    'Email not confirmed': 'Bitte bestätige zuerst deine E-Mail-Adresse.',
    'User already registered': 'Diese E-Mail-Adresse ist bereits registriert.',
    'Password should be at least': 'Das Passwort ist zu kurz. Bitte wähle ein sichereres Passwort.',
    'Network request failed': 'Verbindungsfehler. Bitte überprüfe deine Internetverbindung.',
    'Failed to fetch': 'Verbindungsfehler. Bitte versuche es später erneut.',
    'Nicht eingeloggt': 'Bitte melde dich zuerst an.',
    'Kein Adminzugriff': 'Du hast keine Berechtigung für diese Seite.'
  };

  for (const [key, friendly] of Object.entries(friendlyMessages)) {
    if (message.includes(key)) {
      return friendly;
    }
  }

  return message || 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später erneut.';
}

/**
 * Globaler Error-Handler für unerwartete Fehler
 */
window.addEventListener('error', (event) => {
  console.error('Global Error:', event.error);
  handleError(event.error);
});

/**
 * Globaler Handler für unhandled Promise Rejections
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  handleError(event.reason);
  event.preventDefault(); // Verhindert Konsolen-Fehler
});

