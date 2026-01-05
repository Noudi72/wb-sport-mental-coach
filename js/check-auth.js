// js/check-auth.js
import { supabase } from './supa.js';
import { ADMIN_CONFIG } from './config.js';

export const ADMIN_EMAIL = ADMIN_CONFIG.email;

/**
 * Hilfsfunktion: Prüft ob ein Benutzer Admin ist
 * @param {object} user
 * @returns {boolean}
 */
export function isAdmin(user) {
  return user?.email === ADMIN_EMAIL; // optional: user?.role === 'admin'
}

/**
 * Holt aktuellen Benutzer oder leitet zu login.html weiter
 * @returns {Promise<object>}
 */
export async function requireUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    location.href = 'login.html';
    throw new Error('Nicht eingeloggt');
  }
  return user;
}

/**
 * Holt Admin-Benutzer oder leitet um
 * @returns {Promise<object>}
 */
export async function requireAdmin() {
  const user = await requireUser();
  if (!isAdmin(user)) {
    location.href = 'index.html';
    throw new Error('Kein Adminzugriff');
  }
  return user;
}