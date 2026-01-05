// js/validation.js
// Zentrale Validierungsfunktionen

/**
 * Validiert eine E-Mail-Adresse
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validiert ein Passwort (mindestens 6 Zeichen)
 * @param {string} password
 * @param {number} minLength
 * @returns {boolean}
 */
export function isValidPassword(password, minLength = 6) {
  if (!password || typeof password !== 'string') return false;
  return password.length >= minLength;
}

/**
 * Validiert einen Namen (nicht leer, keine Sonderzeichen)
 * @param {string} name
 * @returns {boolean}
 */
export function isValidName(name) {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && /^[a-zA-ZäöüÄÖÜß\s-]+$/.test(trimmed);
}

/**
 * Sanitized Text (entfernt potenziell gefährliche Zeichen)
 * @param {string} text
 * @returns {string}
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text.trim()
    .replace(/[<>]/g, '') // Entferne < und >
    .substring(0, 10000); // Max Länge
}

/**
 * Validiert ein Formular-Feld und zeigt Fehler an
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} field
 * @param {Function} validator
 * @param {string} errorMessage
 * @returns {boolean}
 */
export function validateField(field, validator, errorMessage) {
  if (!field) return false;
  
  const value = field.value;
  const isValid = validator(value);
  
  // Entferne vorherige Fehler
  field.classList.remove('error');
  const existingError = field.parentElement?.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  
  if (!isValid && value) {
    field.classList.add('error');
    const errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.textContent = errorMessage;
    errorEl.setAttribute('role', 'alert');
    field.parentElement?.appendChild(errorEl);
    return false;
  }
  
  return true;
}

/**
 * Validiert ein komplettes Formular
 * @param {HTMLFormElement} form
 * @param {Object} validators - Objekt mit fieldName -> {validator, message}
 * @returns {boolean}
 */
export function validateForm(form, validators) {
  let isValid = true;
  
  for (const [fieldName, { validator, message }] of Object.entries(validators)) {
    const field = form.querySelector(`[name="${fieldName}"]`);
    if (field && !validateField(field, validator, message)) {
      isValid = false;
    }
  }
  
  return isValid;
}

/**
 * Real-time Validierung für ein Feld
 * @param {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} field
 * @param {Function} validator
 * @param {string} errorMessage
 */
export function setupRealTimeValidation(field, validator, errorMessage) {
  if (!field) return;
  
  field.addEventListener('blur', () => {
    validateField(field, validator, errorMessage);
  });
  
  field.addEventListener('input', () => {
    // Entferne Fehler wenn der Benutzer tippt
    if (field.classList.contains('error')) {
      const error = field.parentElement?.querySelector('.field-error');
      if (error && validator(field.value)) {
        field.classList.remove('error');
        error.remove();
      }
    }
  });
}

