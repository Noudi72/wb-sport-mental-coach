// js/checkin-charts.js
// Visualisierungen für Check-in Daten

import { supabase } from './supa.js';
import { requireUser } from './check-auth.js';

let chart = null;

/**
 * Lädt Check-in Daten und zeigt Visualisierungen
 */
export async function initCheckinCharts() {
  const user = await requireUser();
  const container = document.getElementById('checkin-visualizations');
  const canvas = document.getElementById('checkinChart');
  const periodSelect = document.getElementById('chartPeriod');

  if (!container || !canvas || !periodSelect) return;

  // Lade Check-ins
  const { data: checkins, error } = await supabase
    .from('checkins')
    .select('created_at, answers')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error || !checkins?.length) {
    console.warn('Keine Check-in Daten gefunden');
    return;
  }

  // Zeige Container
  container.style.display = 'block';

  // Erstelle Chart
  const ctx = canvas.getContext('2d');
  
  function updateChart(period = 'all') {
    const now = new Date();
    let filtered = checkins;

    if (period !== 'all') {
      const days = parseInt(period);
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = checkins.filter(c => new Date(c.created_at) >= cutoff);
    }

    if (!filtered.length) {
      if (chart) chart.destroy();
      canvas.parentElement.innerHTML = '<p class="muted">Keine Daten für diesen Zeitraum verfügbar.</p>';
      return;
    }

    // Extrahiere Daten
    const labels = filtered.map(c => {
      const date = new Date(c.created_at);
      return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    });

    const focusData = filtered.map(c => {
      const focus = c.answers?.focus;
      return focus ? parseInt(focus) : null;
    });

    const energyData = filtered.map(c => {
      const energy = c.answers?.energy;
      return energy ? parseInt(energy) : null;
    });

    const moodData = filtered.map(c => {
      const mood = c.answers?.mood;
      const moodMap = { 'Sehr schlecht': 1, 'Schlecht': 2, 'Neutral': 3, 'Gut': 4, 'Sehr gut': 5 };
      return mood ? (moodMap[mood] || null) : null;
    });

    // Zerstöre vorheriges Chart
    if (chart) chart.destroy();

    // Erstelle neues Chart
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Fokus',
            data: focusData,
            borderColor: 'rgb(0, 119, 204)',
            backgroundColor: 'rgba(0, 119, 204, 0.1)',
            tension: 0.4,
            spanGaps: true
          },
          {
            label: 'Energie',
            data: energyData,
            borderColor: 'rgb(46, 125, 50)',
            backgroundColor: 'rgba(46, 125, 50, 0.1)',
            tension: 0.4,
            spanGaps: true
          },
          {
            label: 'Stimmung',
            data: moodData,
            borderColor: 'rgb(255, 152, 0)',
            backgroundColor: 'rgba(255, 152, 0, 0.1)',
            tension: 0.4,
            spanGaps: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: 1,
            max: 5,
            ticks: {
              stepSize: 1
            }
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    });
  }

  // Initial Chart
  updateChart(periodSelect.value);

  // Update bei Perioden-Änderung
  periodSelect.addEventListener('change', (e) => {
    updateChart(e.target.value);
  });
}

