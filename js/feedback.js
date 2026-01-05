// js/feedback.js
import { supabase } from './supa.js';
import { requireUser } from './check-auth.js';
import { flash } from './utils.js';

const user = await requireUser();
const full_name = (user.user_metadata?.full_name || '').toString();

const form = document.getElementById('fbForm');
if (!form) throw new Error('Formular #fbForm nicht gefunden');

// Flash-Ziel sicherstellen
let msgEl = document.getElementById('msg');
if (!msgEl) {
  msgEl = document.createElement('p');
  msgEl.id = 'msg';
  msgEl.className = 'flash';
  form.insertAdjacentElement('afterend', msgEl);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.submitter || form.querySelector('button[type="submit"]');

  const { rating = '', comment = '' } = Object.fromEntries(new FormData(form).entries());
  const ratingVal = rating.trim();
  const commentVal = comment.trim() || null;

  if (!ratingVal) {
    flash('Bitte wähle eine Bewertung aus.', 'err', msgEl);
    return;
  }

  btn.disabled = true;
  const originalText = btn.textContent;
  btn.textContent = 'Sendet …';

  const { error } = await supabase.from('feedback').insert([{
    user_id: user.id,
    full_name,
    rating: ratingVal,
    comment: commentVal,
  }]);

  btn.disabled = false;
  btn.textContent = originalText;

  if (error) {
    console.error('Speicherfehler:', error);
    flash('Feedback konnte nicht gespeichert werden. ❌', 'err', msgEl);
    return;
  }

  form.reset();
  flash('Danke für dein Feedback! 🎉', 'ok', msgEl);
});