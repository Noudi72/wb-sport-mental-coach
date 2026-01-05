// js/contact.js
import { supabase } from './supa.js';
import { flash } from './utils.js';
import { isValidEmail, sanitizeText, setupRealTimeValidation } from './validation.js';

export async function initContact() {
  const form = document.getElementById('contactForm');
  const msgEl = document.getElementById('msg');

  if (!form || !msgEl) {
    console.warn('Kontakt-Formular nicht gefunden');
    return;
  }

  // Real-time Validierung einrichten
  const emailField = form.querySelector('[name="email"]');
  if (emailField) {
    setupRealTimeValidation(emailField, isValidEmail, 'Bitte eine gültige E-Mail-Adresse eingeben.');
  }

  form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = e.submitter || form.querySelector('button[type="submit"]');
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = 'Sendet …';

  const { name, email, message } = Object.fromEntries(new FormData(form).entries());
  const n = name.trim();
  const m = message.trim();
  const eMail = email.trim();

  if (!n || !eMail || !m) {
    flash('Bitte alle Felder ausfüllen.', 'err', msgEl);
    btn.disabled = false;
    btn.textContent = originalText;
    return;
  }

  if (!isValidEmail(eMail)) {
    flash('Bitte eine gültige E‑Mail-Adresse eingeben.', 'err', msgEl);
    btn.disabled = false;
    btn.textContent = originalText;
    return;
  }

  // Sanitize Input
  const sanitizedName = sanitizeText(n);
  const sanitizedMessage = sanitizeText(m);

  try {
    const { error } = await supabase.from('contact_messages').insert([{ 
      name: sanitizedName, 
      email: eMail, 
      message: sanitizedMessage 
    }]);
    if (error) throw error;

    flash('Nachricht gesendet! Vielen Dank! 🙌', 'ok', msgEl);
    form.reset();
  } catch (err) {
    console.error('Fehler beim Senden:', err);
    flash('Fehler beim Senden der Nachricht. Bitte später versuchen.', 'err', msgEl);
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
  });
}

// Legacy Support
if (document.getElementById('contactForm')) {
  initContact();
}