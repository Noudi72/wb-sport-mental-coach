import { supabase } from './supa.js';
import { requireAdmin } from './check-auth.js';
import { flash } from './utils.js';

(async () => {
  const admin = await requireAdmin();
  console.log('Admin eingeloggt:', admin.email);

  const msg = document.getElementById('msg');
  const tbl = document.getElementById('tbl');
  const tbody = tbl?.querySelector('tbody');

  if (!msg || !tbl || !tbody) return;

  const { data, error } = await supabase
    .from('tagebuch')
    .select('created_at, entry, profiles(full_name)')
    .order('created_at', { ascending: false });

  if (error) {
    flash(msg, false, 'Fehler beim Laden: ' + error.message);
    return;
  }

  if (!data?.length) {
    flash(msg, false, 'Keine Tagebuch-Einträge vorhanden.');
    return;
  }

  msg.style.display = 'none';
  tbl.style.display = 'table';

  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(row.created_at).toLocaleString('de-CH')}</td>
      <td>${row.entry ?? ''}</td>
      <td>${row.profiles?.full_name ?? ''}</td>
    `;
    tbody.appendChild(tr);
  });
})();