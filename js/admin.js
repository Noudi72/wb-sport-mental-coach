import { supabase } from './supa.js';
import { requireUser } from './check-auth.js';
import { downloadCSV } from './utils.js';

// Helpers
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const stamp = (ts) => { try { return new Date(ts).toLocaleString('de-CH',{dateStyle:'short',timeStyle:'short'}); } catch { return ts ?? ''; } };
const toLower = (v) => String(v ?? '').toLowerCase();
const WRAPCELL = (v) => {
  const s = String(v ?? '');
  if (!s) return '—';
  return `<div class="truncate" title="${esc(s)}">${esc(s)}</div>`;
};

function flash(selector, isOk, text) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.textContent = text || '';
  el.className = 'flash ' + (isOk ? 'ok' : 'err');
  if (text) setTimeout(() => { el.textContent = ''; }, 2500);
}

function parseDateInput(yyyyMmDd) {
  if (!yyyyMmDd) return null;
  const [y,m,d] = yyyyMmDd.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d); // lokale Mitternacht
}

function inDateRange(d, from, to) {
  if (!d) return false;
  const dt = new Date(d);
  if (Number.isNaN(+dt)) return false;
  if (from && dt < from) return false;
  if (to) {
    const toEnd = new Date(to); toEnd.setDate(toEnd.getDate() + 1); toEnd.setMilliseconds(-1);
    if (dt > toEnd) return false;
  }
  return true;
}

// csvEscape und downloadCSV sind jetzt in utils.js

import { ADMIN_EMAIL } from './check-auth.js';

async function ensureAdmin() {
  await requireUser();
  const { data:{ user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Nicht eingeloggt');
  if ((user.email || '').toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    document.body.innerHTML = '<main class="container"><h1>Kein Zugriff</h1><p>Für diese Seite sind Admin-Rechte erforderlich.</p></main>';
    throw new Error('Kein Admin');
  }
}

const cache = {
  feedback: [],
  checkins: [],
  diary:    []
};
async function loadFeedback() {
  const { data, error } = await supabase.from('feedback')
    .select('id, inserted_at, full_name, email, rating, comment')
    .order('inserted_at', { ascending: false });
  if (error || !data) {
    console.error('Feedback laden fehlgeschlagen:', error);
    return;
  }
  cache.feedback = data;
  renderFeedback();
}

function renderFeedback() {
  const tbody = $('#tbodyFeedback');
  const status = $('#statusFeedback');
  const term = toLower($('#filterFeedback')?.value);
  const from = parseDateInput($('#fromFeedback')?.value);
  const to = parseDateInput($('#toFeedback')?.value);

  const rows = cache.feedback.filter(r =>
    (!term || [r.full_name, r.email, r.rating, r.comment].some(f => toLower(f).includes(term))) &&
    inDateRange(r.inserted_at, from, to)
  );

  status.textContent = rows.length ? `${rows.length} Einträge` : 'Keine passenden Ergebnisse gefunden.';
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${stamp(r.inserted_at)}</td>
      <td>${esc(r.full_name)}</td>
      <td>${esc(r.email)}</td>
      <td>${esc(r.rating)}</td>
      <td>${WRAPCELL(r.comment)}</td>
      <td><button class="btn btn-small btn-delete" data-id="${r.id}" data-table="feedback">🗑️</button></td>
    </tr>`).join('');
}

$('#filterFeedback')?.addEventListener('input', renderFeedback);
$('#fromFeedback')?.addEventListener('change', renderFeedback);
$('#toFeedback')?.addEventListener('change', renderFeedback);
$('#clearFeedback')?.addEventListener('click', () => {
  $('#filterFeedback').value = '';
  $('#fromFeedback').value = '';
  $('#toFeedback').value = '';
  renderFeedback();
});
$('#exportFeedback')?.addEventListener('click', () => {
  const headers = ['Datum', 'Name', 'E-Mail', 'Bewertung', 'Kommentar'];
  const rows = cache.feedback.map(r => ({
    Datum: stamp(r.inserted_at),
    Name: r.full_name,
    'E-Mail': r.email,
    Bewertung: r.rating,
    Kommentar: r.comment
  }));
  downloadCSV('feedback.csv', headers, rows);
});
async function loadAudioUsers() {
  const { data, error } = await supabase.from('profiles')
    .select('id, full_name, email')
    .order('full_name');
  if (error || !data) {
    flash('#audioMsg', false, 'Fehler beim Laden der Nutzer');
    return;
  }

  const sel = $('#selAudioUser');
  sel.innerHTML = data.map(u => `<option value="${u.id}">${esc(u.full_name)}</option>`).join('');
  sel.selectedIndex = 0;
  await renderAudioUserPlaylists();
}

async function renderAudioUserPlaylists() {
  const userId = $('#selAudioUser')?.value;
  if (!userId) return;

  const { data: allPlaylists, error: err1 } = await supabase.from('playlists')
    .select('id, title')
    .order('sort_order');
  const { data: userPlaylists, error: err2 } = await supabase.from('user_playlists')
    .select('playlist_id')
    .eq('user_id', userId);

  if (err1 || err2) {
    flash('#audioMsg', false, 'Fehler beim Laden der Playlists');
    return;
  }

  const userSet = new Set(userPlaylists.map(p => p.playlist_id));

  const ulAll = $('#listAllPlaylists');
  const ulUser = $('#listUserPlaylists');

  ulAll.innerHTML = '';
  ulUser.innerHTML = '';

  for (const p of allPlaylists) {
    const li = document.createElement('li');
    li.textContent = p.title || 'Untitled';
    li.dataset.id = p.id;
    li.draggable = true;
    li.classList.add('draggable');

    (userSet.has(p.id) ? ulUser : ulAll).appendChild(li);
  }

  flash('#audioMsg', true, `Playlists geladen (${userPlaylists.length} zugewiesen)`);
}

$('#selAudioUser')?.addEventListener('change', renderAudioUserPlaylists);
$('#btnAudioReload')?.addEventListener('click', loadAudioUsers);
document.addEventListener('dragstart', (e) => {
  const target = e.target;
  if (target?.classList.contains('draggable')) {
    e.dataTransfer.setData('text/plain', target.dataset.id);
  }
});

$('#listUserPlaylists')?.addEventListener('dragover', (e) => {
  e.preventDefault();
});

$('#listUserPlaylists')?.addEventListener('drop', async (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const li = document.querySelector(`[data-id="${id}"]`);
  const userId = $('#selAudioUser')?.value;
  if (!li || !userId) return;

  await supabase.from('user_playlists').upsert([{ user_id: userId, playlist_id: id }]);
  $('#listUserPlaylists').appendChild(li);
  flash('#audioMsg', true, 'Zugewiesen');
});

$('#listAllPlaylists')?.addEventListener('dragover', (e) => {
  e.preventDefault();
});

$('#listAllPlaylists')?.addEventListener('drop', async (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const li = document.querySelector(`[data-id="${id}"]`);
  const userId = $('#selAudioUser')?.value;
  if (!li || !userId) return;

  await supabase.from('user_playlists')
    .delete()
    .match({ user_id: userId, playlist_id: id });
  $('#listAllPlaylists').appendChild(li);
  flash('#audioMsg', true, 'Entfernt');
});
async function loadQsUsers() {
  const { data, error } = await supabase.from('profiles')
    .select('id, full_name')
    .order('full_name');
  if (error || !data) {
    flash('#qsMsg', false, 'Fehler beim Laden der Nutzer');
    return;
  }

  const sel = $('#selQsUser');
  sel.innerHTML = data.map(u => `<option value="${u.id}">${esc(u.full_name)}</option>`).join('');
  sel.selectedIndex = 0;
  await renderQsAssignments();
}

async function renderQsAssignments() {
  const userId = $('#selQsUser')?.value;
  const scope = $('#selQsScope')?.value;
  if (!userId || !scope) return;

  const { data: allSets, error: err1 } = await supabase.from('frageboegen')
    .select('id, title')
    .eq('scope', scope)
    .order('sort_order');
  const { data: userSets, error: err2 } = await supabase.from('user_frageboegen')
    .select('fragebogen_id')
    .eq('user_id', userId)
    .eq('scope', scope);

  if (err1 || err2) {
    flash('#qsMsg', false, 'Fehler beim Laden der Sets');
    return;
  }

  const userSet = new Set(userSets.map(p => p.fragebogen_id));
  const ulAll = $('#listAllQuestionSets');
  const ulUser = $('#listUserQuestionSets');

  ulAll.innerHTML = '';
  ulUser.innerHTML = '';

  for (const s of allSets) {
    const li = document.createElement('li');
    li.textContent = s.title || 'Untitled';
    li.dataset.id = s.id;
    li.draggable = true;
    li.classList.add('draggable');

    (userSet.has(s.id) ? ulUser : ulAll).appendChild(li);
  }

  flash('#qsMsg', true, `Sets geladen (${userSets.length} zugewiesen)`);
}

$('#selQsUser')?.addEventListener('change', renderQsAssignments);
$('#selQsScope')?.addEventListener('change', renderQsAssignments);
$('#btnQsReload')?.addEventListener('click', loadQsUsers);
$('#btnQsAssign')?.addEventListener('click', async () => {
  const userId = $('#selQsUser')?.value;
  const scope = $('#selQsScope')?.value;
  const selected = $('#listAllQuestionSets li.selected');
  if (!userId || !scope || !selected) {
    flash('#qsMsg', false, 'Bitte Nutzer*in und Set auswählen');
    return;
  }

  const id = selected.dataset.id;
  const { error } = await supabase.from('user_frageboegen').upsert([{ user_id: userId, fragebogen_id: id, scope }]);
  if (error) {
    flash('#qsMsg', false, 'Zuweisung fehlgeschlagen');
  } else {
    await renderQsAssignments();
    flash('#qsMsg', true, 'Zugewiesen');
  }
});

document.querySelectorAll('ul[data-draggable]')?.forEach(ul => {
  ul.addEventListener('click', e => {
    if (e.target.tagName === 'LI') {
      ul.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
      e.target.classList.add('selected');
    }
  });
});

export async function initAdmin() {
  try {
    await ensureAdmin();
    loadFeedback();
    loadAudioUsers();
    loadQsUsers();
  } catch (err) {
    console.error(err);
  }
}

// Legacy Support
if (document.getElementById('crm-admin')) {
  initAdmin();
}
