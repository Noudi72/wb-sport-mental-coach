// js/views/fragebogen-view.js
// Mental-Check-in View

export async function renderFragebogenView() {
  return `
    <h1>Mental-Check-in</h1>

    <form id="checkinForm" novalidate>
      <!-- 1) Tageszustand -->
      <fieldset>
        <legend>Tageszustand (Skala 1–5)</legend>

        <label for="focus">Fokus</label>
        <select id="focus" name="focus" required>
          <option value="" disabled selected>Bitte wählen …</option>
          <option value="1">1 – sehr niedrig</option>
          <option value="2">2 – niedrig</option>
          <option value="3">3 – mittel</option>
          <option value="4">4 – hoch</option>
          <option value="5">5 – sehr hoch</option>
        </select>
        <small class="hint">1 = sehr niedrig, 5 = sehr hoch</small>

        <label for="energy">Energie</label>
        <select id="energy" name="energy" required>
          <option value="" disabled selected>Bitte wählen …</option>
          <option value="1">1 – sehr niedrig</option>
          <option value="2">2 – niedrig</option>
          <option value="3">3 – mittel</option>
          <option value="4">4 – hoch</option>
          <option value="5">5 – sehr hoch</option>
        </select>
      </fieldset>

      <!-- 2) Gefühl & Auslöser -->
      <fieldset>
        <legend>Gefühl &amp; Auslöser</legend>

        <label for="emotion">Emotion</label>
        <select id="emotion" name="emotion">
          <option value="" selected>— optional —</option>
          <option value="Freude">Freude</option>
          <option value="Ärger">Ärger</option>
          <option value="Traurigkeit">Traurigkeit</option>
          <option value="Angst">Angst</option>
          <option value="Gelassenheit">Gelassenheit</option>
          <option value="Stress">Stress</option>
        </select>

        <label for="trigger">Trigger (Auslöser)</label>
        <input id="trigger" type="text" name="trigger" placeholder="Was hat das Gefühl ausgelöst? (optional)" />
      </fieldset>

      <!-- 3) Weitere Angaben -->
      <fieldset>
        <legend>Weitere Angaben</legend>

        <label for="mood">Allgemeine Stimmung (optional)</label>
        <select id="mood" name="mood">
          <option value="" selected>— optional —</option>
          <option>Sehr schlecht</option>
          <option>Schlecht</option>
          <option>Neutral</option>
          <option>Gut</option>
          <option>Sehr gut</option>
        </select>

        <label for="gratitude">Wofür bist du dankbar? (optional)</label>
        <textarea id="gratitude" name="gratitude" rows="2" placeholder="z. B. ein Moment oder eine Person"></textarea>

        <label for="comment">Kommentar (optional)</label>
        <textarea id="comment" name="comment" rows="3" placeholder="Freitext …"></textarea>
      </fieldset>

      <button type="submit" class="btn btn-primary">Senden</button>
    </form>

    <p id="msg" class="notice" role="status" aria-live="polite"></p>

    <!-- Visualisierungen -->
    <section class="card mt-3" id="checkin-visualizations" style="display: none;">
      <h2>Deine Check-in Verlauf</h2>
      <div class="toolbar">
        <select id="chartPeriod">
          <option value="7">Letzte 7 Tage</option>
          <option value="14">Letzte 14 Tage</option>
          <option value="30">Letzte 30 Tage</option>
          <option value="all">Alle</option>
        </select>
      </div>
      <div style="position: relative; height: 300px; margin-top: 1rem;">
        <canvas id="checkinChart"></canvas>
      </div>
    </section>
  `;
}

