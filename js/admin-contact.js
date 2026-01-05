import { supabase } from './supa.js';
import { requireAdmin } from './check-auth.js';

(async () => {
  // Admin-Login erzwingen
  const admin = await requireAdmin();

  console.log('Admin eingeloggt:', admin.email);

  const msg = document.getElementById('msg');
  const tbl = document.getElementById('tbl');
  const tbody = tbl.querySelector('tbody');

  // Kontakt-Nachrichten laden
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    msg.textContent = 'Fehler beim Laden: ' + error.message;
    msg.style.color = 'red';
    return;
  }

  if (!data.length) {
    msg.textContent = 'Keine Kontakt-Nachrichten vorhanden.';
    return;
  }

  msg.style.display = 'none';
  tbl.style.display = 'table';

  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(row.created_at).toLocaleString()}</td>
      <td>${row.name ?? ''}</td>
      <td>${row.email ?? ''}</td>
      <td>${row.message ?? ''}</td>
    `;
    tbody.appendChild(tr);
  });
})();