# 🧘 WB Sport Mental Coach

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/Noudi72/wb-sport-mental-coach)
![GitHub issues](https://img.shields.io/github/issues/Noudi72/wb-sport-mental-coach)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Noudi72/wb-sport-mental-coach)

Eine moderne Web-Applikation für mentales Training, Motivation und persönliche Weiterentwicklung.

🌐 **Live Demo:** [GitHub Pages](https://noudi72.github.io/wb-sport-mental-coach/)

## ✨ Features

### Für Benutzer
- 📝 **Tagebuch** - Persönliche Einträge mit Suche und Export
- 📊 **Mental-Check-in** - Tägliche Selbstreflexion mit Visualisierungen
- 🎧 **Hörbücher & Meditationen** - Audio-Player mit Playlist-Wiedergabe
- 💬 **Feedback** - Feedback-System für kontinuierliche Verbesserung
- 📱 **Progressive Web App (PWA)** - Installierbar, funktioniert offline
- 🌙 **Dark Mode** - Augenfreundlicher Modus für abends
- 🔒 **Sichere Authentifizierung** - Über Supabase Auth

### Für Administratoren
- 👥 **Kundenverwaltung** - Übersicht aller Klienten
- 📈 **Datenanalyse** - CSV-Export für alle Daten
- 🎵 **Playlist-Verwaltung** - Zuweisung von Audio-Inhalten
- 📋 **Fragebogen-Verwaltung** - Zuweisung von Check-in Sets

## 🚀 Schnellstart

### 🌐 Live-Version
Die App ist live auf GitHub Pages verfügbar: **[Live Demo](https://noudi72.github.io/wb-sport-mental-coach/)**

### Voraussetzungen
- Node.js (für Entwicklung)
- Supabase Account (Backend)

### Installation

1. **Repository klonen**
```bash
git clone <repository-url>
cd wb-mental-coach
```

2. **Dependencies installieren**
```bash
npm install
```

3. **Konfiguration einrichten**

Erstelle eine `.env` Datei (optional, für Produktion):
```env
VITE_SUPABASE_URL=deine-supabase-url
VITE_SUPABASE_ANON_KEY=dein-anon-key
VITE_ADMIN_EMAIL=admin@example.com
```

**Hinweis:** Für lokale Entwicklung funktioniert die App auch ohne `.env` Datei mit den Standard-Werten in `js/config.js`.

4. **Lokalen Server starten**

Die App kann direkt im Browser geöffnet werden oder mit einem lokalen Server:

```bash
# Mit Python
python -m http.server 8000

# Mit Node.js (http-server)
npx http-server -p 8000

# Mit Vite (empfohlen für Entwicklung)
npm run dev
```

5. **Im Browser öffnen**
```
http://localhost:8000
```

## 📁 Projektstruktur

```
wb-mental-coach/
├── assets/              # Statische Assets (Logo, Audio)
├── css/
│   ├── partials/       # CSS-Module
│   └── styles.css      # Haupt-Stylesheet
├── js/
│   ├── config.js       # Zentrale Konfiguration
│   ├── supa.js         # Supabase Client
│   ├── utils.js        # Utility-Funktionen
│   ├── validation.js   # Input-Validierung
│   ├── error-handler.js # Globaler Error-Handler
│   ├── dark-mode.js    # Dark Mode Funktionalität
│   ├── nav.js          # Navigation
│   ├── login.js        # Login/Registrierung
│   ├── tagebuch.js     # Tagebuch-Funktionalität
│   ├── fragebogen.js   # Check-in Formular
│   ├── checkin-charts.js # Check-in Visualisierungen
│   ├── audio.js        # Audio-Player
│   ├── feedback.js     # Feedback-System
│   ├── contact.js      # Kontaktformular
│   └── admin.js        # Admin-Panel
├── index.html          # Startseite
├── login.html          # Login/Registrierung
├── tagebuch.html       # Tagebuch
├── frageboegen.html    # Mental-Check-in
├── hoerbuch.html       # Audio-Player
├── feedback.html       # Feedback
├── contact.html        # Kontakt
├── admin.html          # Admin-Panel
├── manifest.json       # PWA Manifest
├── sw.js              # Service Worker
└── package.json       # Dependencies
```

## 🛠️ Technologie-Stack

- **Frontend:** Vanilla JavaScript (ES Modules), HTML5, CSS3
- **Backend:** Supabase (Auth, Database, Storage)
- **Charts:** Chart.js (für Visualisierungen)
- **Build:** Vite (optional, für Produktion)

## 🔐 Sicherheit

- ✅ Credentials über Umgebungsvariablen
- ✅ Input-Sanitization
- ✅ XSS-Schutz
- ✅ CSRF-Schutz (via Supabase)
- ✅ Admin-Zugriffskontrolle

## 📱 Progressive Web App (PWA)

Die App ist als PWA konfiguriert:
- ✅ Installierbar auf mobilen Geräten
- ✅ Offline-Funktionalität (Service Worker)
- ✅ App-Icon und Splash Screen
- ✅ Caching für bessere Performance

## 🎨 Dark Mode

Der Dark Mode kann über den Toggle-Button in der Navigation aktiviert werden. Die Präferenz wird im LocalStorage gespeichert.

## 📊 Datenbank-Schema (Supabase)

Die App verwendet folgende Tabellen:

- `profiles` - Benutzerprofile
- `tagebuch` - Tagebuch-Einträge
- `checkins` - Mental-Check-in Daten
- `feedback` - Feedback-Einträge
- `contact_messages` - Kontaktformular-Nachrichten
- `playlists` - Audio-Playlists
- `tracks` - Audio-Tracks
- `user_playlists` - Playlist-Zuweisungen
- `frageboegen` - Fragebogen-Sets
- `user_frageboegen` - Fragebogen-Zuweisungen

## 🚀 Deployment

### Option 1: Statisches Hosting
Die App kann auf jedem statischen Hosting-Service deployed werden:
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

### Option 2: Mit Build-Pipeline
```bash
npm run build
# Output in dist/
```

## 🧪 Testing

Tests sind mit Vitest konfiguriert:
```bash
npm test
```

## 📝 Entwicklung

### Code-Style
- ES6+ JavaScript
- Modularer Aufbau (ES Modules)
- Konsistente Namenskonventionen
- Kommentare für komplexe Funktionen

### Neue Features hinzufügen
1. Erstelle neue Module in `js/`
2. Importiere in entsprechende HTML-Datei
3. Füge Styles in `css/partials/` hinzu
4. Dokumentiere in diesem README

## 🐛 Bekannte Probleme / TODO

- [ ] Responsive Design weiter optimieren
- [ ] Build-Pipeline mit Vite einrichten
- [ ] Weitere Tests hinzufügen
- [ ] Internationalisierung (i18n)

## 📄 Lizenz

© 2025 Waltraud Blaurock Sport Mental Coach

## 👥 Support

Bei Fragen oder Problemen bitte ein Issue erstellen oder Kontakt aufnehmen.

---

**Version:** 2.0.0  
**Letzte Aktualisierung:** 2025-01-27

