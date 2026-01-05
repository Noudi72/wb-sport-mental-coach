// js/config.js
// Zentrale Konfigurationsdatei für die App

/**
 * Supabase-Konfiguration
 * Für Produktion: Diese Werte sollten über Umgebungsvariablen gesetzt werden
 * Fallback auf hardcoded Werte für lokale Entwicklung
 * 
 * Umgebungsvariablen werden nur mit Vite erkannt. Für statische Hosting:
 * Erstelle eine config.js Datei die diese Werte exportiert (nicht in Git committen!)
 */
const getEnvVar = (key, fallback) => {
  // Versuche window.env (für statisches Hosting)
  if (typeof window !== 'undefined' && window.env && window.env[key]) {
    return window.env[key];
  }
  // Versuche import.meta.env (für Vite)
  if (typeof import !== 'undefined' && import.meta?.env?.[key]) {
    return import.meta.env[key];
  }
  return fallback;
};

export const SUPABASE_CONFIG = {
  url: getEnvVar('VITE_SUPABASE_URL', "https://svzelqkspfaedhclhqdj.supabase.co"),
  anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2emVscWtzcGZhZWRoY2xocWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0ODQ2NjYsImV4cCI6MjA3MDA2MDY2Nn0.KNIOlH33cC4nIWWp0rhZZY63yPuH1bQ7aeLRO3DHPqQ")
};

/**
 * Admin-Konfiguration
 * Zentrale Stelle für Admin-E-Mail
 */
export const ADMIN_CONFIG = {
  email: getEnvVar('VITE_ADMIN_EMAIL', "w.blaurock80@outlook.com")
};

/**
 * App-Konfiguration
 */
export const APP_CONFIG = {
  name: "WB Sport Mental Coach",
  version: "2.0.0",
  defaultLanguage: "de"
};

