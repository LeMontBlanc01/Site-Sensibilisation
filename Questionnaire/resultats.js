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

function loadResults() {
  const score = localStorage.getItem('quizScore');
  const niveau = localStorage.getItem('quizNiveau');
  const nom = localStorage.getItem('quizNom');
  const total = localStorage.getItem('quizTotal') || '15';

  const resultScore = document.getElementById('result-score');
  const resultNiveau = document.getElementById('result-niveau');
  const resultNom = document.getElementById('result-nom');
  const resultMessage = document.getElementById('result-message');
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

  exportButton.addEventListener('click', exportResults);
}

function initResultPage() {
  const restartButton = document.getElementById('btn-restart');
  if (restartButton) {
    restartButton.addEventListener('click', () => {
      window.location.href = 'questionnaire.html';
    });
  }
  loadResults();
}

window.addEventListener('load', initResultPage);
