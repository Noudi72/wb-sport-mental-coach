// js/views/audio-view.js
// Hörbücher & Meditationen View

export async function renderAudioView() {
  return `
    <h1>Hörbücher & Meditationen</h1>
    <p>Wähle eine Session und tippe auf „Play".</p>

    <section class="card" id="audio-area">
      <h2>Deine Playlists</h2>
      <div id="audioMsg" class="muted" aria-live="polite"></div>

      <div class="audio-controls">
        <button id="prevBtn" class="btn btn-secondary" type="button" aria-label="Vorheriger Track">⏮️</button>
        <button id="nextBtn" class="btn btn-secondary" type="button" aria-label="Nächster Track">⏭️</button>
        <button id="shuffleBtn" class="btn btn-secondary" type="button" aria-label="Zufällige Wiedergabe">🔀</button>
      </div>

      <ul id="playlist" class="playlist-list" aria-label="Audio-Playlist"></ul>

      <audio id="player" controls preload="metadata" aria-label="Audio-Player"></audio>
      
      <div class="audio-info">
        <small id="trackInfo" class="muted"></small>
      </div>
    </section>
  `;
}

