
// Cette fonction formate une date en français avec jour, mois, année, heure et minute
function formatDate(date) {
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Cette fonction génère le texte à exporter pour un résultat donné
function createResultText(score, total, niveau, nom) {
  return `Prénom : ${nom}\nNiveau : ${niveau}\nScore : ${score} / ${total}\nDate : ${formatDate(new Date())}`;
}

// Cette fonction gère l'export des résultats
function exportResults() {
  // Si un historique global est présent, exporter tous les résultats
  const histRaw = localStorage.getItem('quizResults');
  if (histRaw) {
    try {
      const hist = JSON.parse(histRaw);
      if (Array.isArray(hist) && hist.length) {
        const lines = hist.map((h, i) => {
          return `--- Résultat ${i + 1} ---\nPrénom : ${h.nom}\nNiveau : ${h.niveau}\nScore : ${h.score} / ${h.total}\nDate : ${new Date(h.date).toLocaleString('fr-FR')}\n`;
        });
        const body = lines.join('\n');
        const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resultats-tous-les-niveaux.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        const mailtoBody = encodeURIComponent(body.replace(/\n/g, '\r\n'));
        const mailto = `mailto:?subject=Résultats questionnaires&body=${mailtoBody}`;
        window.location.href = mailto;
        return;
      }
    } catch (e) {
      console.error('Erreur lecture historique des résultats', e);
    }
  }

  // Sinon, comportement historique (export du résultat courant)
  const score = localStorage.getItem('quizScore');
  const niveau = localStorage.getItem('quizNiveau');
  const nom = localStorage.getItem('quizNom');
  const total = localStorage.getItem('quizTotal') || '15';

  if (!score || !niveau || !nom) {
    alert('Aucun résultat disponible à exporter.');
    return;
  }

  const body = createResultText(score, total, niveau, nom);
  const blob = new Blob([body], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resultats-${niveau.toLowerCase()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  const mailtoBody = encodeURIComponent(body.replace(/\n/g, '\r\n'));
  const mailto = `mailto:?subject=Résultats du questionnaire&body=${mailtoBody}`;
  window.location.href = mailto;
}

// Cette fonction charge les résultats depuis le localStorage et les affiche sur la page
function loadResults() {
  const score = localStorage.getItem('quizScore');
  const niveau = localStorage.getItem('quizNiveau');
  const nom = localStorage.getItem('quizNom');
  const total = localStorage.getItem('quizTotal') || '15';

  const resultScore = document.getElementById('result-score');
  const resultNiveau = document.getElementById('result-niveau');
  const resultNom = document.getElementById('result-nom');
  const resultMessage = document.getElementById('result-message');
  const resultReview = document.getElementById('result-review');
  const exportButton = document.getElementById('btn-export-results');

  if (!score || !niveau || !nom) {
    resultScore.textContent = 'Aucun résultat trouvé. Reviens au questionnaire pour commencer.';
    resultNiveau.textContent = '';
    resultNom.textContent = '';
    exportButton.style.display = 'none';
    return;
  }

  resultScore.textContent = `Score : ${score} / ${total}`;
  resultNiveau.textContent = `Niveau : ${niveau}`;
  resultNom.textContent = `Prénom : ${nom}`;
  resultMessage.textContent = `Bravo ! Tes résultats sont prêts à être exportés.`;

  const reviewRaw = localStorage.getItem('quizReview');
  let review = [];
  try {
    review = JSON.parse(reviewRaw || '[]');
  } catch (e) {
    console.error('Impossible de lire les détails du quiz', e);
  }

  if (review && review.length && resultReview) {
    const list = document.createElement('ol');
    review.forEach(item => {
      const li = document.createElement('li');
      li.className = item.correct ? 'result-review-ok' : 'result-review-ko';
      li.innerHTML = `<strong>${item.questionId}</strong> - ${item.correct ? 'Correct' : 'Incorrect'}<br>Réponse : ${item.selected}<br>${item.result}`;
      list.appendChild(li);
    });
    resultReview.appendChild(list);
  } else if (resultReview) {
    resultReview.textContent = 'Aucun détail de question disponible.';
  }

  exportButton.addEventListener('click', exportResults);
}

// Fonction d'initialisation de la page des résultats
function initResultPage() {
  const restartButton = document.getElementById('btn-restart');
  if (restartButton) {
    restartButton.addEventListener('click', () => {
      window.location.href = 'questionnaire.html';
    });
  }
  loadResults();
}

window.addEventListener('load', initResultPage); // Appel de la fonction d'initialisation lorsque la page est chargée
