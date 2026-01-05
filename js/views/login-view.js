// js/views/login-view.js
// Login/Registrierung View

export async function renderLoginView() {
  return `
    <h1 class="center">Login</h1>

    <!-- Meldungen (ok/err) -->
    <p id="msg" class="flash" aria-live="polite"></p>

    <!-- Login-Formular -->
    <form id="loginForm" autocomplete="on">
      <label for="email">E‑Mail</label>
      <input type="email" id="email" name="email" autocomplete="email" required />

      <label for="password">Passwort</label>
      <input type="password" id="password" name="password" autocomplete="current-password" required />

      <button type="submit">Einloggen</button>
    </form>

    <!-- Registrieren: Vorname/Nachname vorbereitet (wird per JS ein-/ausgeblendet) -->
    <div class="center mt-2">
      <a href="#" id="toggle-mode">Neu registrieren</a>
    </div>

    <form id="registerForm" autocomplete="on" style="display:none; margin-top:1rem;">
      <label for="reg_email">E‑Mail</label>
      <input type="email" id="reg_email" name="email" autocomplete="email" required />

      <label for="reg_password">Passwort</label>
      <input type="password" id="reg_password" name="password" autocomplete="new-password" required />

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label for="first_name">Vorname</label>
          <input type="text" id="first_name" name="first_name" required />
        </div>
        <div>
          <label for="last_name">Nachname</label>
          <input type="text" id="last_name" name="last_name" required />
        </div>
      </div>

      <button type="submit">Registrieren</button>
    </form>
  `;
}

