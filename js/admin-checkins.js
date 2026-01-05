import { supabase } from '/js/supa.js';

const ADMIN_MAIL = 'w.blaurock80@outlook.com';
const msg = document.getElementById('msg');
const tbl = document.getElementById('tbl');
const tbody = tbl.querySelector('tbody');
const searchInput = document.getElementById('searchInput');
const exportBtn = document.getElementById('exportBtn');

// Admin-Check
const { data: { user }, error } = await supabase.auth.getUser();
if (error || !user || user.email !== ADMIN_MAIL) {
  alert('Kein Zugriff – bitte als Admin einloggen');
  location.href = 'login.html';
}

// Daten laden
const { data, error: err } = await supabase
  .from('checkins')
  .select('*')
  .order('created_at', { ascending: false });

if (err) {
  msg.textContent = 'Fehler: ' + err.message;
} else if (!data.length) {
  msg.textContent = 'Keine Einträge vorhanden.';
} else {
  msg.style.display = 'none';
  tbl.style.display = 'table';
  exportBtn.style.display = 'inline-block';

  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(row.created_at).toLocaleString()}</td>
      <td>${row.name || '-'}</td>
      <td>${row.entry || '-'}</td>
    `;
    tbody.appendChild(tr);
  });

  // Suche
  searchInput.addEventListener('input', () => {
    const val = searchInput.value.toLowerCase();
    Array.from(tbody.rows).forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(val) ? '' : 'none';
    });
  });

  // CSV Export
  exportBtn.addEventListener('click', () => {
    const csvRows = [
      ['Datum', 'Name', 'Eintrag'],
      ...data.map(r => [
        new Date(r.created_at).toLocaleString(),
        r.name || '',
        r.entry?.replace(/\n/g, ' ') || ''
      ])
    ];
    const csvContent = csvRows.map(e => e.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'checkins.csv';
    a.click();
    URL.revokeObjectURL(url);
  });
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  location.href = 'login.html';
});
