// js/audio.js
import { supabase } from "./supa.js";
import { flash } from "./utils.js";

const msg = document.getElementById("audioMsg");
const list = document.getElementById("playlist");
const player = document.getElementById("player");

let currentTrackIndex = -1;
let tracks = [];
const STORAGE_KEY = 'wb-audio-progress';

// Lade gespeicherten Fortschritt
function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

// Speichere Fortschritt
function saveProgress(trackId, currentTime, duration) {
  try {
    const progress = loadProgress();
    progress[trackId] = { currentTime, duration, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Progress speichern fehlgeschlagen:', e);
  }
}

// Setze Fortschritt beim Laden
function restoreProgress(trackId) {
  const progress = loadProgress();
  const saved = progress[trackId];
  if (saved && saved.currentTime && saved.duration) {
    // Nur wenn weniger als 24 Stunden alt
    const age = Date.now() - (saved.timestamp || 0);
    if (age < 24 * 60 * 60 * 1000) {
      player.currentTime = saved.currentTime;
    }
  }
}

function render(items) {
  list.innerHTML = "";
  tracks = items;

  if (!items?.length) {
    flash("Keine Inhalte gefunden.", "info", msg);
    return;
  }

  flash("", "info", msg); // Meldung leeren

  items.forEach(({ title, src, id }, index) => {
    const li = document.createElement("li");
    li.className = "audio-item";
    
    const btn = document.createElement("button");
    btn.className = "btn audio-track-btn";
    btn.textContent = title || "Track";
    btn.setAttribute("data-index", index);
    btn.setAttribute("data-id", id || src);
    
    // Aktiver Track markieren
    if (index === currentTrackIndex) {
      btn.classList.add("active");
    }
    
    btn.addEventListener("click", () => {
      playTrack(index);
    });
    
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function playTrack(index) {
  if (index < 0 || index >= tracks.length) return;
  
  const track = tracks[index];
  if (!track.src) return;
  
  currentTrackIndex = index;
  
  // Update UI
  list.querySelectorAll('.audio-track-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
  
  // Setze Quelle und lade Fortschritt
  player.src = track.src;
  restoreProgress(track.id || track.src);
  
  player.play().catch((err) => {
    console.error('Playback fehlgeschlagen:', err);
    flash('Wiedergabe fehlgeschlagen. Bitte versuche es erneut.', 'err', msg);
  });
  
  // Update Titel
  if (msg) {
    msg.textContent = `▶️ ${track.title || 'Track'}`;
  }
}

// Auto-Play nächster Track
player.addEventListener('ended', () => {
  if (currentTrackIndex >= 0 && currentTrackIndex < tracks.length - 1) {
    playTrack(currentTrackIndex + 1);
  } else {
    currentTrackIndex = -1;
    if (msg) msg.textContent = 'Wiedergabe beendet';
  }
});

// Speichere Fortschritt während Wiedergabe
player.addEventListener('timeupdate', () => {
  if (currentTrackIndex >= 0 && tracks[currentTrackIndex]) {
    const track = tracks[currentTrackIndex];
    saveProgress(track.id || track.src, player.currentTime, player.duration);
  }
});

// --- Cloud: Playlists & Tracks laden ----------------------------
async function tryLoadCloud() {
  try {
    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) throw userErr || new Error("Kein Benutzer");

    const { data: playlistLinks, error: linkErr } = await supabase
      .from("user_playlists")
      .select("playlist_id")
      .eq("user_id", user.id);

    if (linkErr) throw linkErr;

    const playlistIds = playlistLinks?.map(r => r.playlist_id).filter(Boolean);
    if (!playlistIds?.length) return [];

    const { data: tracks, error } = await supabase
      .from("tracks")
      .select("title, storage_path, sort_order, playlist_id")
      .in("playlist_id", playlistIds)
      .order("sort_order", { ascending: true });

    if (error) throw error;

    const items = [];
    for (const row of tracks || []) {
      const path = row.storage_path || row.title || "";
      if (!path) continue;

      const { data: signed, error: sErr } = await supabase.storage
        .from("audio")
        .createSignedUrl(path, 3600);

      if (sErr || !signed?.signedUrl) continue;

      items.push({
        title: row.title || path.split("/").pop(),
        src: signed.signedUrl,
      });
    }

    return items;
  } catch (e) {
    console.error("Cloud load failed:", e);
    return null;
  }
}

// --- Lokale Demo-Playlist ---------------------------------------
function getLocalDemo() {
  const base = "assets/audiobooks";
  return [
    { title: "Meditation", src: `${base}/deep-relaxing-music.mp3` },
    { title: "Motivation", src: `${base}/meditation-background-music.mp3` },
    { title: "Entspannung", src: `${base}/test_tone_440Hz_2s.wav` },
  ];
}

// Navigation Buttons
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const trackInfo = document.getElementById("trackInfo");

prevBtn?.addEventListener("click", () => {
  if (currentTrackIndex > 0) {
    playTrack(currentTrackIndex - 1);
  }
});

nextBtn?.addEventListener("click", () => {
  if (currentTrackIndex >= 0 && currentTrackIndex < tracks.length - 1) {
    playTrack(currentTrackIndex + 1);
  } else if (tracks.length > 0) {
    playTrack(0); // Zurück zum Anfang
  }
});

let shuffleMode = false;
shuffleBtn?.addEventListener("click", () => {
  shuffleMode = !shuffleMode;
  shuffleBtn.classList.toggle("active", shuffleMode);
  shuffleBtn.title = shuffleMode ? "Zufällige Wiedergabe deaktivieren" : "Zufällige Wiedergabe aktivieren";
});

// Zufälliger Track
function playRandomTrack() {
  if (tracks.length === 0) return;
  const randomIndex = Math.floor(Math.random() * tracks.length);
  playTrack(randomIndex);
}

// Update Track Info
player.addEventListener("loadedmetadata", () => {
  if (currentTrackIndex >= 0 && tracks[currentTrackIndex] && trackInfo) {
    const duration = formatTime(player.duration);
    trackInfo.textContent = `Dauer: ${duration}`;
  }
});

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Auto-Play nächster Track (mit Shuffle)
player.addEventListener('ended', () => {
  if (shuffleMode) {
    playRandomTrack();
  } else if (currentTrackIndex >= 0 && currentTrackIndex < tracks.length - 1) {
    playTrack(currentTrackIndex + 1);
  } else if (tracks.length > 0) {
    // Zurück zum Anfang
    playTrack(0);
  } else {
    currentTrackIndex = -1;
    if (msg) msg.textContent = 'Wiedergabe beendet';
  }
});

// --- Start -------------------------------------------------------
(async function init() {
  flash("Lade Playlists ...", "info", msg);

  const cloudItems = await tryLoadCloud();

  if (cloudItems?.length) {
    // Füge IDs hinzu falls nicht vorhanden
    const itemsWithIds = cloudItems.map((item, index) => ({
      ...item,
      id: item.id || `track-${index}`
    }));
    render(itemsWithIds);
  } else {
    flash("Demo-Tracks (lokal). Für echte Inhalte bitte Playlists zuweisen.", "info", msg);
    const demoItems = getLocalDemo().map((item, index) => ({
      ...item,
      id: `demo-${index}`
    }));
    render(demoItems);
  }
})();