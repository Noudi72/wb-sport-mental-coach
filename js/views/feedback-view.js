// js/views/feedback-view.js
// Feedback View

export async function renderFeedbackView() {
  return `
    <h1>Feedback</h1>
    <p>Dein Feedback hilft uns, die Einheiten zu verbessern.</p>

    <form id="fbForm" class="form-container">
      <label>
        Wie hilfreich war die heutige Einheit?<br />
        <select name="rating" required>
          <option value="" disabled selected>Bitte wählen …</option>
          <option>1 – gar nicht</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5 – sehr hilfreich</option>
        </select>
      </label>

      <label>
        Dein Kommentar:<br />
        <textarea name="comment" rows="4" placeholder="Optional …"></textarea>
      </label>

      <button type="submit" class="btn-primary">Senden</button>
    </form>

    <p id="msg"></p>
  `;
}

