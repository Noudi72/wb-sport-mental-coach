// js/login.js
import { supabase } from './supa.js';
import { flash } from './utils.js';
import { ADMIN_EMAIL } from './check-auth.js';
import { isValidEmail, isValidPassword, isValidName, setupRealTimeValidation } from './validation.js';

const $ = (sel) => document.querySelector(sel);
const loginForm = $('#loginForm');
const registerForm = $('#registerForm');
const toggleLink = $('#toggle-mode');

function setMode(mode) {
  const isRegister = mode === 'register';
  if (loginForm) loginForm.style.display = isRegister ? 'none' : '';
  if (registerForm) registerForm.style.display = isRegister ? '' : 'none';
  if (toggleLink) toggleLink.textContent = isRegister ? 'Ich habe schon ein Konto' : 'Neu registrieren';
}

const params = new URLSearchParams(location.search);
setMode(params.get('mode') === 'register' ? 'register' : 'login');

toggleLink?.addEventListener('click', (e) => {
  e.preventDefault();
  const isLoginHidden = loginForm && getComputedStyle(loginForm).display === 'none';
  setMode(isLoginHidden ? 'login' : 'register');
});

async function ensureProfile(user, fullNameFallback = '') {
  if (!user) return;
  const full_name = (user.user_metadata?.full_name || fullNameFallback || '').trim();
  const email = user.email || '';
  const { error } = await supabase.from('profiles').upsert(
    { id: user.id, email, full_name },
    { onConflict: 'id' }
  );
  if (error) console.warn('profiles upsert error:', error.message);
}

// Login
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('#email')?.value.trim();
  const password = $('#password')?.value;
  const btn = loginForm.querySelector('button[type="submit"]');
  if (!email || !password) {
    flash('Bitte E-Mail und Passwort ausfüllen.', 'err');
    $('#email')?.focus();
    return;
  }

  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = 'Einloggen …';

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const { data: { user } } = await supabase.auth.getUser();
    if (user) await ensureProfile(user);

    const redirect = (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ? 'admin.html' : 'index.html';
    location.href = redirect;
  } catch (err) {
    console.error(err);
    flash(err.message || 'Login fehlgeschlagen.', 'err');
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

// Registrierung
registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('#reg_email')?.value.trim();
  const password = $('#reg_password')?.value;
  const first = $('#first_name')?.value.trim();
  const last = $('#last_name')?.value.trim();
  const full = `${first} ${last}`.trim();

  if (!isValidName(first) || !isValidName(last)) {
    flash('Bitte gültige Vorname und Nachname angeben (mindestens 2 Zeichen).', 'err');
    $('#first_name')?.focus();
    return;
  }
  
  if (!isValidPassword(password)) {
    flash('Das Passwort muss mindestens 6 Zeichen lang sein.', 'err');
    $('#reg_password')?.focus();
    return;
  }
  
  if (!isValidEmail(email)) {
    flash('Bitte eine gültige E-Mail-Adresse eingeben.', 'err');
    $('#reg_email')?.focus();
    return;
  }

  const btn = registerForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = 'Registriert …';

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: full, first_name: first, last_name: last } },
    });
    if (error) throw error;
    if (data?.user) await ensureProfile(data.user, full);

    setMode('login');
    $('#email').value = email;
    flash('Registrierung erfolgreich. Bitte E-Mail bestätigen und einloggen.', 'ok', 6000);
  } catch (err) {
    console.error(err);
    flash(err.message || 'Registrierung fehlgeschlagen.', 'err', 6000);
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

// Bereits eingeloggt?
(async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    location.href = (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ? 'admin.html' : 'index.html';
  }
})();