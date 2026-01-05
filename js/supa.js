// js/supa.js
// Supabase client initialization using CDN ES module
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.7.1/+esm";
import { SUPABASE_CONFIG } from "./config.js";

// 🚀 Create and export a reusable client instance
export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

///////////////////////////
// 🧾 Auth-Funktionen
///////////////////////////

/**
 * Registriert einen neuen Benutzer mit Name-Metadaten
 * @param {string} email
 * @param {string} password
 * @param {string} full_name
 */
export async function signUp(email, password, full_name) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
    },
  });
}

/**
 * Login mit E-Mail & Passwort
 * @param {string} email
 * @param {string} password
 */
export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

/**
 * Logout
 */
export async function signOut() {
  return await supabase.auth.signOut();
}

///////////////////////////
// 👤 User-Helpers
///////////////////////////

/**
 * Holt aktuellen eingeloggten User
 */
export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

/**
 * Holt Session-Daten
 */
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data?.session ?? null;
}