// js/fragebogen.js
import { supabase } from './supa.js';
import { requireUser } from './check-auth.js';
import { flash } from './utils.js';
import { initCheckinCharts } from './checkin-charts.js';

const form = document.getElementById('checkinForm');
const msgEl = document.getElementById('msg');

function collectAnswers(formEl) {
  const fd = new FormData(formEl);
  const keys = ['mood', 'comment', 'focus', 'energy', 'emotion', 'trigger', 'gratitude'];
  const result = {};

  for (const key of keys) {
    const val = fd.get(key);
    if (val && val.trim()) result[key] = val.trim();
  }

  return result;
}

async function main() {
  const user = await requireUser();
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = e.submitter || form.querySelector('button[type="submit"]');
    btn?.setAttribute('disabled', true);
    flash('', 'info', msgEl);

    try {
      const answers = collectAnswers(form);

      if (!Object.keys(answers).length) {
        flash('Bitte fülle mindestens ein Feld aus.', 'err', msgEl);
        return;
      }

      const { error } = await supabase.from('checkins').insert({
        user_id: user.id,
        answers,
      });

      if (error) throw error;

      form.reset();
      flash('Danke! Dein Check‑in wurde gespeichert. ✅', 'ok', msgEl);
      
      // Aktualisiere Charts
      await initCheckinCharts();
    } catch (err) {
      console.error('Check‑in speichern fehlgeschlagen:', err);
      flash('Speichern fehlgeschlagen. Bitte versuche es erneut. ❗', 'err', msgEl);
    } finally {
      btn?.removeAttribute('disabled');
    }
  });

  // Initialisiere Charts
  await initCheckinCharts();
}

main();