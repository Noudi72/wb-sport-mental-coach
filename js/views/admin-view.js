// js/views/admin-view.js
// Admin View

export async function renderAdminView() {
  return `
    <h1>Admin – Ergebnisse aller Klienten</h1>

    <!-- Kunden‑Kartei (Beta) -->
    <section class="card" id="crm-admin" role="region" aria-labelledby="crm-title">
      <h2 id="crm-title">Kunden‑Kartei</h2>
      <div class="toolbar">
        <label for="clientSearch" class="sr-only">Suche</label>
        <input id="clientSearch" type="search" placeholder="Klient*in suchen (Name oder E‑Mail)" />
        <button id="clientReload" class="btn btn-secondary" type="button">Aktualisieren</button>
      </div>

      <div class="table-scroll">
        <div style="display:flex; gap:1rem; flex-wrap:wrap">
          <div style="flex:1 1 320px; min-width:280px">
            <h3>Alle Klient*innen</h3>
            <ul id="clientList" aria-label="Klientenliste"></ul>
          </div>
          <div style="flex:2 1 420px; min-width:320px">
            <h3>Details</h3>
            <div id="clientCard" class="box" aria-live="polite">
              <p class="muted">Bitte eine Person links auswählen. Danach kannst du unten Playlists und Fragen‑Sets zuweisen.</p>
              <div id="clientHeader" style="display:none">
                <h4 id="clientName">—</h4>
                <p id="clientEmail" class="muted">—</p>
                <div class="toolbar">
                  <button id="jumpAudio" class="btn btn-secondary" type="button">Zu Audio‑Playlists</button>
                  <button id="jumpQs" class="btn btn-secondary" type="button">Zu Fragen‑Sets</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p id="crmMsg" class="muted" role="status"></p>
    </section>

    <!-- Feedback -->
    <section class="card" role="region" aria-labelledby="feedback-title">
      <h2 id="feedback-title">Feedback – Antworten</h2>
      <div class="toolbar">
        <input id="filterFeedback" type="search" placeholder="Suche (Name, E‑Mail, Kommentar, Bewertung)" />
        <input id="fromFeedback" type="date" />
        <input id="toFeedback" type="date" />
        <button id="clearFeedback" class="btn btn-secondary" type="button">Filter zurücksetzen</button>
        <button id="exportFeedback" class="btn" type="button">CSV exportieren</button>
      </div>
      <div id="statusFeedback" class="muted">Lade Daten …</div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Bewertung</th>
              <th>Kommentar</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody id="tbodyFeedback">
            <tr><td colspan="6" class="muted">Lade Daten …</td></tr>
          </tbody>
        </table>
      </div>
      <p id="feedbackMsg" class="muted" role="status"></p>
    </section>

    <!-- Audio-Playlists -->
    <section class="card" id="audio-admin" role="region" aria-labelledby="audio-title">
      <h2 id="audio-title">Audio‑Playlists</h2>
      <div class="toolbar">
        <label for="selAudioUser" class="sr-only">Klient*in</label>
        <select id="selAudioUser"></select>
        <button id="btnAudioReload" class="btn btn-secondary" type="button">Aktualisieren</button>
      </div>

      <div class="table-scroll">
        <div style="display:flex; gap:1rem; flex-wrap:wrap">
          <div style="flex:1 1 320px; min-width:280px">
            <h3>Alle Playlists</h3>
            <ul id="listAllPlaylists" data-draggable="playlist"></ul>
          </div>
          <div style="flex:1 1 320px; min-width:280px">
            <h3>Zugewiesen an Klient*in</h3>
            <ul id="listUserPlaylists" data-droppable="playlist"></ul>
          </div>
        </div>
      </div>
      <p id="audioMsg" class="muted" role="status"></p>
    </section>

    <!-- Fragen‑Sets -->
    <section class="card" id="qs-admin" role="region" aria-labelledby="qs-title">
      <h2 id="qs-title">Fragen‑Sets</h2>
      <div class="toolbar">
        <label for="selQsUser" class="sr-only">Klient*in</label>
        <select id="selQsUser"></select>
        <label for="selQsScope" class="sr-only">Bereich</label>
        <select id="selQsScope">
          <option value="checkin">Check-in</option>
          <option value="feedback">Feedback</option>
        </select>
        <button id="btnQsAssign" class="btn" type="button">Zuweisen</button>
        <button id="btnQsReload" class="btn btn-secondary" type="button">Aktualisieren</button>
      </div>

      <div class="table-scroll">
        <div style="display:flex; gap:1rem; flex-wrap:wrap">
          <div style="flex:1 1 320px; min-width:280px">
            <h3>Verfügbare Sets</h3>
            <ul id="listAllQuestionSets"></ul>
          </div>
          <div style="flex:1 1 320px; min-width:280px">
            <h3>Zugewiesen an Klient*in</h3>
            <ul id="listUserQuestionSets"></ul>
          </div>
        </div>
      </div>
      <p id="qsMsg" class="muted" role="status"></p>
    </section>

    <!-- Check-in -->
    <section class="card" role="region" aria-labelledby="checkins-title">
      <h2 id="checkins-title">Check-in – Ergebnisse</h2>
      <p class="muted">Hinweis: Werte stammen aus dem JSON-Feld <code>answers</code>.</p>
      <div class="toolbar">
        <input id="filterCheckins" type="search" placeholder="Suche (Name, E‑Mail, Felder & Kommentare)" />
        <input id="fromCheckins" type="date" />
        <input id="toCheckins" type="date" />
        <button id="clearCheckins" class="btn btn-secondary" type="button">Filter zurücksetzen</button>
        <button id="exportCheckins" class="btn" type="button">CSV exportieren</button>
      </div>
      <div id="statusCheckins" class="muted">Lade Daten …</div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Focus</th>
              <th>Energy</th>
              <th>Emotion</th>
              <th>Trigger</th>
              <th>Stimmung</th>
              <th>Dankbarkeit</th>
              <th>Kommentar</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody id="tbodyCheckins">
            <tr><td colspan="11" class="muted">Lade Daten …</td></tr>
          </tbody>
        </table>
      </div>
      <p id="checkinsMsg" class="muted" role="status"></p>
    </section>

    <!-- Tagebuch -->
    <section class="card" role="region" aria-labelledby="diary-title">
      <h2 id="diary-title">Tagebuch – Einträge</h2>
      <div class="toolbar">
        <input id="filterDiary" type="search" placeholder="Suche (Name, E‑Mail, Eintrag)" />
        <input id="fromDiary" type="date" />
        <input id="toDiary" type="date" />
        <button id="clearDiary" class="btn btn-secondary" type="button">Filter zurücksetzen</button>
        <button id="exportDiary" class="btn" type="button">CSV exportieren</button>
      </div>
      <div id="statusDiary" class="muted">Lade Daten …</div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Eintrag</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody id="tbodyDiary">
            <tr><td colspan="5" class="muted">Lade Daten …</td></tr>
          </tbody>
        </table>
      </div>
      <p id="diaryMsg" class="muted" role="status"></p>
    </section>

    <audio id="adminPreview" class="admin-audio-preview" controls style="display:none; position:fixed; right:1rem; bottom:1rem; max-width:360px; z-index:2000"></audio>
  `;
}

