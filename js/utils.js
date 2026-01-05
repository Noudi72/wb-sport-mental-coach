// js/utils.js
// 🔧 Nützliche Helferfunktionen für Flash-Messages, CSV, Datumsformat etc.

////////////////////////////
// ✅ Flash-Message System
////////////////////////////

/**
 * Zeigt eine Flash-Nachricht an (Text, Typ, Dauer)
 * @param {string} text
 * @param {"ok"|"err"|"info"} type
 * @param {HTMLElement|null} el
 * @param {number} timeout
 */
export function flash(text, type = "ok", el = document.getElementById("msg"), timeout = 3000) {
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

///////////////////////////////////
// 📄 CSV-Export für Admin-Daten
///////////////////////////////////

/**
 * Escaped einen Wert für CSV
 * @param {any} value
 * @returns {string}
 */
export function csvEscape(value) {
  const s = String(value ?? '');
  if (/[",\n]/.test(s)) return '"' + s.replaceAll('"', '""') + '"';
  return s;
}

/**
 * Exportiert ein Array von Objekten als CSV-Datei
 * @param {Object[]} data
 * @param {string} filename
 * @param {string} delimiter - Trennzeichen (Standard: Semikolon für Excel)
 */
export function exportCsv(data, filename = "export.csv", delimiter = ";") {
  if (!data?.length) return;

  const keys = Object.keys(data[0]);
  const rows = [
    keys.map(csvEscape).join(delimiter), // Header
    ...data.map(row =>
      keys.map(k => csvEscape(row[k])).join(delimiter)
    )
  ];

  const csv = '\ufeff' + rows.join("\n"); // BOM für Excel UTF-8
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exportiert Daten mit Headern als CSV (für Admin-Bereich)
 * @param {string} filename
 * @param {string[]} headers
 * @param {Object[]} rows
 */
export function downloadCSV(filename, headers, rows) {
  const headerLine = headers.map(csvEscape).join(',');
  const lines = rows.map(r => headers.map(h => csvEscape(r[h])).join(','));
  const csv = '\ufeff' + [headerLine, ...lines].join('\n'); // BOM für Excel
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; 
  a.download = filename; 
  a.style.display = 'none';
  document.body.appendChild(a); 
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0);
}

//////////////////////////////
// 🗓️ Datumsformat-Helfer
//////////////////////////////

/**
 * Format: 14.08.2025, 12:30 Uhr
 * @param {string|Date} ts
 * @returns {string}
 */
export function formatDate(ts) {
  const date = new Date(ts);
  return date.toLocaleString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  }).replace(",", " Uhr:");
}

//////////////////////////////
// 👤 Benutzer laden + prüfen
//////////////////////////////

import { supabase } from "./supa.js";

/**
 * Gibt den aktuellen User zurück oder redirectet zu login.html
 * @returns {Promise<object>}
 */
export async function loadUserOrRedirect() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    location.href = "login.html";
    throw new Error("Nicht eingeloggt");
  }
  return user;
}