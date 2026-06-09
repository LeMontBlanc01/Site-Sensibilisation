
function formatDate(date) {
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}



function createResultText(score, total, niveau, nom) {
  return `Prénom : ${nom}\nNiveau : ${niveau}\nScore : ${score} / ${total}\nDate : ${formatDate(new Date())}`;
}

function exportResults() {
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

  const score = localStorage.getItem('quizScore');
  const niveau = localStorage.getItem('quizNiveau');
  const nom = localStorage.getItem('quizNom');
  const total = localStorage.getItem('quizTotal') || '15';
  const correction = JSON.parse(localStorage.getItem('quizCorrection'));

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
    const lastQuizPage = localStorage.getItem('lastQuizPage') || 'questionnaire.html';
    restartButton.addEventListener('click', () => {
      window.location.href = lastQuizPage;
    });
  }
  loadResults();

  // Prépare le sélecteur pour modifier une question
  const select = document.getElementById('question-edit');
  const editBtn = document.getElementById('btn-edit-question');
  if (select) {
    // Remplir avec les questions présentes dans le review (si disponible), sinon lister q1..q18
    const reviewRaw = localStorage.getItem('quizReview');
    let review = [];
    try {
      review = JSON.parse(reviewRaw || '[]');
    } catch (e) { review = []; }

    const seen = new Set();
    if (Array.isArray(review) && review.length) {
      review.forEach(item => {
        if (item && item.questionId && !seen.has(item.questionId)) {
          const opt = document.createElement('option');
          opt.value = item.questionId;
          opt.textContent = item.questionId.replace(/^q/, 'Question ');
          select.appendChild(opt);
          seen.add(item.questionId);
        }
      });
    }

    // si aucune entrée review, ajouter q1..q18
    if (!select.querySelector('option[value^="q"]')) {
      for (let i = 1; i <= 18; i++) {
        const qid = `q${i}`;
        const opt = document.createElement('option');
        opt.value = qid;
        opt.textContent = `Question ${i}`;
        select.appendChild(opt);
      }
    }
  }

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      const selected = document.getElementById('question-edit')?.value;
      if (!selected) {
        alert('Veuillez sélectionner une question à modifier.');
        return;
      }
      // Indique à la page du quiz quelle question afficher et revenir aux résultats après validation
      localStorage.setItem('editQuestionId', selected);
      localStorage.setItem('backToResults', '1');
      const lastQuizPage = localStorage.getItem('lastQuizPage') || 'questionnaire.html';
      window.location.href = lastQuizPage;
    });
  }
}

window.addEventListener('load', initResultPage);
