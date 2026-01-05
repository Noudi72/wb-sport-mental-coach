// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

function flash(text, type = "ok", el = document.getElementById("msg"), timeout = 3000) {
  if (!el) return;
  el.textContent = text;
  el.className = `flash ${type}`;
  if (timeout) {
    clearTimeout(flash._t);
    flash._t = setTimeout(() => {
      el.textContent = "";
      el.className = "flash";
    }, timeout);
  }
}

describe('flash()', () => {
  it('zeigt Flash-Nachricht korrekt an', () => {
    document.body.innerHTML = '<p id="msg"></p>';
    const el = document.getElementById('msg');

    flash('Hallo Test!', 'ok', el);

    expect(el.textContent).toBe('Hallo Test!');
    expect(el.className).toContain('ok');
  });
});