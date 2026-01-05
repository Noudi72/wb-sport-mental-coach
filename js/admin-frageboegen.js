import { supabase } from './supa.js';
import { requireAdmin } from './check-auth.js';

(async () => {
  // Admin-Login erzwingen
  const admin = await requireAdmin();

  console.log('Admin eingeloggt:', admin.email);

  const msg = document.getElementById('msg');
  const tbl = document.getElementById('tbl');
  const tbody = tbl.querySelector('tbody');

  // Check-in Daten laden
  const { data, error } = await supabase
    .from('checkins')
    .select('created_at, answers, profiles(full_name)')
    .order('created_at', { ascending: false });

  if (error) {
    msg.textContent = 'Fehler beim Laden: ' + error.message;
    msg.style.color = 'red';
    return;
  }

  if (!data.length) {
    msg.textContent = 'Keine Check-in Einträge vorhanden.';
    return;
  }

  msg.style.display = 'none';
  tbl.style.display = 'table';

  data.forEach(row => {
    const answers = row.answers || {};
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(row.created_at).toLocaleString()}</td>
      <td>${row.profiles?.full_name ?? ''}</td>
      <td>${answers.mood ?? ''}</td>
      <td>${answers.focus ?? ''}</td>
      <td>${answers.energy ?? ''}</td>
      <td>${answers.comment ?? ''}</td>
    `;
    tbody.appendChild(tr);
  });
})();