// js/tagebuch.js
import { supabase } from './supa.js';
import { requireUser } from './check-auth.js';
import { flash, formatDate, exportCsv } from './utils.js';

let user = null;
let allEntries = []; // Speichert alle Einträge für Suche und Export

// Einträge laden & anzeigen
async function renderEntries(searchTerm = '') {
  const entriesEl = document.getElementById('entries');
  const statusEl = document.getElementById('diaryStatus');
  const msgEl = document.getElementById('msg');
  
  if (!entriesEl || !user) return;
  
  entriesEl.innerHTML = '<p class="muted">Lade Einträge …</p>';

  const { data, error } = await supabase
    .from('tagebuch')
    .select('created_at, entry')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fehler beim Laden:', error);
    entriesEl.innerHTML = '<p class="flash err">Fehler beim Laden der Einträge</p>';
    flash('Fehler beim Laden: ' + error.message, 'err', msgEl);
    return;
  }

  allEntries = data || [];

  // Filter nach Suchbegriff
  const filtered = searchTerm
    ? allEntries.filter(e => 
        e.entry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(e.created_at).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allEntries;

  if (!filtered.length) {
    entriesEl.innerHTML = searchTerm 
      ? '<p class="muted">Keine Einträge gefunden, die "' + searchTerm + '" enthalten.</p>'
      : '<p class="muted">Noch keine Einträge vorhanden.</p>';
    if (statusEl) statusEl.textContent = '';
    return;
  }

  // Status anzeigen
  if (statusEl) {
    statusEl.textContent = searchTerm
      ? `${filtered.length} von ${allEntries.length} Einträgen gefunden`
      : `${allEntries.length} Einträge`;
  }

  const ul = document.createElement('ul');
  ul.className = 'diary';

  filtered.forEach(({ created_at, entry }) => {
    const li = document.createElement('li');
    const dateStr = formatDate(created_at);
    let entryText = entry;
    
    // Highlight Suchbegriff
    if (searchTerm) {
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      entryText = entryText.replace(regex, '<mark>$1</mark>');
    }
    
    li.innerHTML = `<small>${dateStr}</small><p>${entryText}</p>`;
    ul.appendChild(li);
  });

  entriesEl.innerHTML = '';
  entriesEl.appendChild(ul);
}

// Export-Funktion
function exportDiaryEntries() {
  const msgEl = document.getElementById('msg');
  if (!allEntries.length) {
    flash('Keine Einträge zum Exportieren vorhanden.', 'info', msgEl);
    return;
  }

  const data = allEntries.map(e => ({
    Datum: formatDate(e.created_at),
    Eintrag: e.entry
  }));

  exportCsv(data, `tagebuch-export-${new Date().toISOString().split('T')[0]}.csv`);
  flash('Tagebuch erfolgreich exportiert! ✅', 'ok', msgEl);
}


// Initialisierungsfunktion für SPA
export async function initTagebuch() {
  user = await requireUser();
  
  const form = document.getElementById('diaryForm');
  const entryInput = document.getElementById('entry');
  const entriesEl = document.getElementById('entries');
  const msgEl = document.getElementById('msg');
  const searchInput = document.getElementById('diarySearch');
  const exportBtn = document.getElementById('exportDiaryBtn');
  const statusEl = document.getElementById('diaryStatus');

  if (!form || !entryInput || !entriesEl || !msgEl) {
    console.warn('Tagebuch-Elemente nicht gefunden');
    return;
  }

  // Eintrag speichern
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = entryInput?.value?.trim() || '';

    if (!text) {
      flash('Bitte gib einen Tagebuch-Eintrag ein.', 'err', msgEl);
      entryInput?.focus();
      return;
    }

    const btn = e.submitter || form.querySelector('button[type="submit"]');
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Speichert …';

    const { error } = await supabase
      .from('tagebuch')
      .insert([{ user_id: user.id, entry: text }]);

    btn.disabled = false;
    btn.textContent = originalText;

    if (error) {
      console.error('Fehler beim Speichern:', error);
      flash('Fehler beim Speichern: ' + error.message, 'err', msgEl);
      return;
    }

    form.reset();
    flash('Eintrag gespeichert. ✅', 'ok', msgEl);
    await renderEntries();
  });

  // Event Listeners
  searchInput?.addEventListener('input', (e) => {
    renderEntries(e.target.value);
  });

  exportBtn?.addEventListener('click', exportDiaryEntries);

  // Initial laden
  await renderEntries();
}

// Legacy Support: Wenn direkt geladen (nicht als SPA)
if (document.getElementById('diaryForm')) {
  initTagebuch();
}