// js/views/home-view.js
// Home/Startseite View

export async function renderHomeView() {
  return `
    <section class="hero" aria-labelledby="hero-title">
      <h1 id="hero-title">Willkommen bei WB Sport Mental Coach</h1>
      <p class="hero-subtitle">Ihr Partner für mentales Training, Motivation und persönliche Weiterentwicklung.</p>
    </section>

    <section class="features-grid" aria-labelledby="features-title">
      <h2 id="features-title" class="section-title">Meine Angebote</h2>
      <div class="feature-card">
        <h3>Tagebuch</h3>
        <p>Halte deine Gedanken und Erlebnisse fest. Durchsuche und exportiere deine Einträge.</p>
        <a href="tagebuch.html" class="btn btn-secondary">Zum Tagebuch</a>
      </div>
      <div class="feature-card">
        <h3>Mental-Check-in</h3>
        <p>Reflektiere deinen Tag und verfolge deine Entwicklung mit interaktiven Visualisierungen.</p>
        <a href="frageboegen.html" class="btn btn-secondary">Check-in starten</a>
      </div>
      <div class="feature-card">
        <h3>Hörbücher & Meditationen</h3>
        <p>Entspanne mit geführten Meditationen und motivierenden Hörbüchern.</p>
        <a href="hoerbuch.html" class="btn btn-secondary">Audio anhören</a>
      </div>
      <div class="feature-card">
        <h3>Feedback</h3>
        <p>Teile deine Erfahrungen und hilf uns, die App kontinuierlich zu verbessern.</p>
        <a href="feedback.html" class="btn btn-secondary">Feedback geben</a>
      </div>
    </section>
  `;
}

