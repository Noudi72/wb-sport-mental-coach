// js/admin-feedback.js
import { requireAdmin } from './check-auth.js';
import { flash } from './utils.js';
import { FeedbackService } from './feedback-service.js';

(async () => {
  try {
    const admin = await requireAdmin();
    console.log('Admin eingeloggt:', admin.email);

    const msg = document.getElementById('msg');
    const tbl = document.getElementById('tbl');

    if (!msg || !tbl) {
      console.error('UI-Elemente "msg" oder "tbl" fehlen im DOM.');
      return;
    }

    const tbody = tbl.querySelector('tbody');
    if (!tbody) {
      console.error('Das <tbody> Element fehlt in der Tabelle.');
      return;
    }

    const service = new FeedbackService();
    const { data, error } = await service.getAll();

    if (error) {
      console.error('Fehler beim Laden der Feedbackdaten:', error);
      tbl.style.display = 'none';
      flash(msg, false, 'Fehler beim Laden: ' + error.message);
      return;
    }

    if (!data || data.length === 0) {
      tbl.style.display = 'none';
      flash(msg, false, 'Keine Feedback-Einträge vorhanden.');
      return;
    }

    msg.style.display = 'none';
    tbl.style.display = 'table';

    data.forEach(({ created_at, rating, comment, full_name }) => {
      const tr = document.createElement('tr');

      const dateTd = document.createElement('td');
      dateTd.textContent = new Date(created_at).toLocaleString('de-CH');

      const ratingTd = document.createElement('td');
      ratingTd.textContent = rating ?? '';

      const commentTd = document.createElement('td');
      commentTd.textContent = comment ?? '';

      const nameTd = document.createElement('td');
      nameTd.textContent = full_name ?? '';

      tr.append(dateTd, ratingTd, commentTd, nameTd);
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Unbehandelter Fehler:', err);
    const msg = document.getElementById('msg');
    if (msg) flash(msg, false, 'Ein unerwarteter Fehler ist aufgetreten.');
  }
})();