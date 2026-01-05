// js/views/contact-view.js
// Kontakt View

export async function renderContactView() {
  return `
    <h1>Kontakt</h1>

    <form id="contactForm">
      <label>Name:<br />
        <input type="text" name="name" required />
      </label>

      <label>E-Mail:<br />
        <input type="email" name="email" required />
      </label>

      <label>Nachricht:<br />
        <textarea name="message" rows="4" required></textarea>
      </label>

      <button type="submit">Senden</button>
    </form>

    <p id="msg"></p>
  `;
}

