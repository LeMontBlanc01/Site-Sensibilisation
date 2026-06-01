console.log("JS chargé !"); // Affiche un message dans la console pour confirmer que le fichier JS est bien chargé
let score = 0;
const joueurNom = prompt("Entrez votre prénom :") || "Anonyme";
const quizNiveau = "Moyen";
const state = {};   //État de chaque question : canvas, contexte, connexions tracées, bloc gauche sélectionné
let quizReview = [];
const flagStorageKey = 'quizFlags_moyen';
let quizFlags = {};

function loadQuizFlags() {
  try {
    quizFlags = JSON.parse(localStorage.getItem(flagStorageKey) || '{}');
  } catch (e) {
    quizFlags = {};
    console.error('Impossible de charger l\'état des flags', e);
  }
}

function saveQuizFlags() {
  localStorage.setItem(flagStorageKey, JSON.stringify(quizFlags));
}

function updateFlagUI(questionId) {
  const question = document.getElementById(questionId);
  if (!question) return;
  const btn = question.querySelector('.flag-btn');
  const flagged = Boolean(quizFlags[questionId]);
  if (btn) {
    btn.textContent = flagged ? 'Retirer le marqueur' : 'Marquer cette question à revoir';
    btn.setAttribute('aria-pressed', String(flagged));
  }
  question.classList.toggle('flagged', flagged);
}

function initFlagCheckboxes() {
  document.querySelectorAll('.question').forEach(question => {
    const questionId = question.id;

    // create a small button placed after the validate button
    if (!question.querySelector('.flag-btn')) {
      const validerBtn = document.getElementById(`btn-valider-${questionId}`);
      const flagBtn = document.createElement('button');
      flagBtn.type = 'button';
      flagBtn.className = 'flag-btn';
      flagBtn.dataset.questionId = questionId;
      flagBtn.addEventListener('click', () => {
        quizFlags[questionId] = !Boolean(quizFlags[questionId]);
        saveQuizFlags();
        updateFlagUI(questionId);
      });

      // insert right after the validate button, otherwise at the end
      if (validerBtn && validerBtn.parentNode) {
        validerBtn.parentNode.insertBefore(flagBtn, validerBtn.nextSibling);
      } else {
        question.appendChild(flagBtn);
      }
    }

    // set initial state
    const btn = question.querySelector('.flag-btn');
    if (btn) {
      btn.textContent = Boolean(quizFlags[questionId]) ? 'Retirer le marqueur' : 'Marquer cette question à revoir';
      btn.setAttribute('aria-pressed', String(Boolean(quizFlags[questionId])));
    }
    updateFlagUI(questionId);
  });
}

// Ordre aléatoire des questions
let questionOrder = [];
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Initialise l'ordre aléatoire des questions et configure les boutons "Suivant" en conséquence
function initRandomQuestions() {
  const qs = Array.from(document.querySelectorAll('.question')).map(q => q.id);
  if (!qs.length) return;
  questionOrder = shuffle(qs);

  questionOrder.forEach((id, idx) => {
    const nextBtn = document.getElementById(`btn-suivant-${id}`);
    if (nextBtn) {
      if (idx < questionOrder.length - 1) {
        nextBtn.onclick = () => showQuestion(questionOrder[idx + 1]);
      } else {
        nextBtn.onclick = goToResults;
        nextBtn.textContent = 'Voir les résultats';
      }
    }
  });

  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');
  document.getElementById(questionOrder[0]).style.display = 'block';
  
  const progress = document.getElementById('progress');
  if (progress) progress.max = questionOrder.length;
  
  updateProgress(questionOrder[0]);
}

function melangerReponses(questionId) {
  if (['q15', 'q16', 'q17'].includes(questionId)) return; //Les questions ou il faut relier des éléments ne sont pas mélangées

  const conteneur = document.getElementById(questionId);
  const labels = Array.from(conteneur.querySelectorAll('label'));

  const paires = labels.map(label => {
    const br = label.nextSibling?.nodeName === 'BR' ? label.nextSibling : null;
    return { label, br };
  });

  paires.forEach(({ label, br }) => {
    if (br) br.remove();
    label.remove();
  });

  shuffle(paires);

  const ancre = conteneur.querySelector('h3');
  paires.forEach(({ label }) => {
    ancre.insertAdjacentElement('afterend', label);
    label.insertAdjacentElement('afterend', document.createElement('br'));
  });
}

window.addEventListener('load', () => {
  loadQuizFlags();
  initFlagCheckboxes();
  initRandomQuestions();
}); // Initialise les questions aléatoires et les flags au chargement de la page

async function goToResults() {
  // Vérifier que le score affiché correspond au score calculé
  const scoreEl = document.getElementById('score');
  let displayed = score;
  if (scoreEl) {
    const parsed = parseInt((scoreEl.textContent || '').replace(/\D/g, ''), 10);
    if (!Number.isNaN(parsed)) displayed = parsed;
  }
  if (displayed !== score) {
    console.warn('Score affiché différent du score interne, envoi du score affiché :', displayed, 'interne:', score);
    score = displayed;
    updateScore();
  }

  const confirmed = confirm('Validez-vous définitivement vos réponses et souhaitez-vous envoyer votre score au serveur ?');
  if (confirmed) {
    try {
      await envoyerScore(joueurNom, score, quizNiveau, 18);
    } catch (e) {
      console.error('Erreur lors de l\'envoi du score :', e);
    }
  }

  localStorage.setItem('quizReview', JSON.stringify(quizReview));
  localStorage.setItem('quizScore', String(score));
  localStorage.setItem('quizNiveau', quizNiveau);
  localStorage.setItem('quizNom', joueurNom);
  localStorage.setItem('quizTotal', '18');
  // Enregistrer dans l'historique global des résultats
  try {
    const hist = JSON.parse(localStorage.getItem('quizResults') || '[]');
    hist.push({ nom: joueurNom, niveau: quizNiveau, score: score, total: 18, date: new Date().toISOString() });
    localStorage.setItem('quizResults', JSON.stringify(hist));
  } catch (e) {
    console.error('Impossible de sauvegarder l\'historique des résultats', e);
  }
  window.location.href = 'resultats.html';
}

function showQuestion(id) {
  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');  //On récupère toutes les divs de la classe "question" et on les cache
  document.getElementById(id).style.display = 'block';  //On affiche uniquement la question dont l'id est passé en paramètre
  updateProgress(id);
  
  //Vide les messages de résultat quand on change de question
  ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13','q14','q15','q16','q17'].forEach(qid => {
    if (id !== qid) {
      const r = document.getElementById(`result-${qid}`);
      if (r) r.textContent = '';
    }
  });

  //Les canvas ont une taille 0 quand leur question est cachée,
  //il faut donc les redimensionner au moment où elles deviennent visibles
  const match = id.match(/^q(15|16|17)$/);
  if (match) {
    const n = match[1];
    resizeCanvas(n);
    redraw(n);
  }

  updateProgress(id);
  melangerReponses(id);

}

function showNextQuestion(currentId) {
  const idx = questionOrder.indexOf(currentId);
  if (idx < 0) return;
  if (idx < questionOrder.length - 1) {
    showQuestion(questionOrder[idx + 1]);
  } else {
    goToResults();
  }
}

function recordQuestionReview(questionId, selected, resultText, correct) {
  const reviewEntry = {
    questionId,
    selected: selected && selected.length ? selected.join(', ') : 'Aucune réponse',
    result: resultText,
    correct,
  };
  quizReview = quizReview.filter(entry => entry.questionId !== questionId);
  quizReview.push(reviewEntry);
  localStorage.setItem('quizReview', JSON.stringify(quizReview));
}

function showResult(id) {
  document.querySelectorAll('.result').forEach(r => r.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

//Fonction qui permet de vérifier la réponse de la question 1
function checkQ1() {
  const selected = Array.from(document.querySelectorAll('input[name="q1"]:checked'))
              .map(el => el.value);

  const correct = ["12"]; //La bonne réponse: 12 caractères

  const result = document.getElementById("result-q1");

  if (arraysEqual(selected, correct)) {
    result.textContent = "Bonne réponse !Pour un mot de passe fort, il est recommandé d'utiliser au moins 12 caractères, incluant des majuscules, des minuscules, des chiffres et des symboles.";
    result.style.color = "green";
    score++;
    recordQuestionReview('q1', selected, result.textContent, true);
    document.getElementById("btn-valider-q1").style.display = "none";
    document.getElementById("btn-suivant-q1").style.display = "inline-block";
  } else {
    result.textContent = "Mauvaise réponse. Il est recommandé d'utiliser au moins 12 caractères pour un mot de passe fort.";
    result.style.color = "red";
    recordQuestionReview('q1', selected, result.textContent, false);
    document.getElementById("btn-valider-q1").style.display = "none";
    setTimeout(() => showNextQuestion('q1'), 2000);
  }
  updateScore();
}


// a = réponses cochées par l'utilisateur
// b = bonnes réponses définies dans le code
// La fonction compare les deux tableaux pour vérifier si la réponse est correcte
function arraysEqual(a, b) {
    return a.length === b.length && a.every(v => b.includes(v));
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `Score : ${score}`;
    }
}
updateScore();

// Fonction qui génère un résumé de la question avec les réponses sélectionnées et le résultat affiché, pour l'export des résultats
function getQuestionSummary(questionNumber) {
    const selected = Array.from(document.querySelectorAll(`input[name="q${questionNumber}"]:checked`))
                          .map(el => el.value);
    const answerText = selected.length ? selected.join(', ') : 'Aucune réponse';
    const resultText = document.getElementById(`result-q${questionNumber}`)?.textContent || 'Pas de résultat';
    return `Question ${questionNumber}: ${answerText}\nRésultat: ${resultText}`;
}

function exportResults() {
    const niveau = "Moyen";
    const lines = [
        `Nom : ${joueurNom}`,
        `Niveau : ${niveau}`,
        `Score : ${score}/18`,
        '',
        'Détail des réponses :'
    ];
    for (let i = 1; i <= 18; i++) {
        lines.push(getQuestionSummary(i));
        lines.push('');
    }

    const fileContent = lines.join('\n');
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `resultats_${niveau.toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const subject = encodeURIComponent(`Résultats questionnaire ${niveau}`);
    const body = encodeURIComponent(`Bonjour,\n\nVeuillez trouver ci-joint le fichier de mes résultats.\n\nNom : ${joueurNom}\nNiveau : ${niveau}\nScore : ${score}/18\n\nMerci.`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

//Fonction qui permet de vérifier la réponse de la question 2
function checkQ2() {
    const selected = Array.from(document.querySelectorAll('input[name="q2"]:checked'))
                          .map(el => el.value);

  const correct = ["segmentation"];  //La bonne réponse: la segmentation réseau

    const result = document.getElementById("result-q2");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! La segmentation réseau permet de diviser un réseau en sous-réseaux plus petits, ce qui améliore la sécurité en limitant la propagation d'une attaque.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q2', selected, result.textContent, true);
        document.getElementById("btn-valider-q2").style.display = "none";
        document.getElementById("btn-suivant-q2").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. La segmentation réseau consiste à diviser un réseau en sous-réseaux pour limiter les risques en cas de compromission.";
        result.style.color = "red";
        recordQuestionReview('q2', selected, result.textContent, false);
        document.getElementById("btn-valider-q2").style.display = "none";
        setTimeout(() => showNextQuestion('q2'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 3
function checkQ3() {
    const selected = Array.from(document.querySelectorAll('input[name="q3"]:checked'))
                          .map(el => el.value);

  const correct = ["2fa", "unique"]; //Les bonnes réponses: 2FA + mot de passe unique

    const result = document.getElementById("result-q3");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! L'authentification à deux facteurs (2FA) ajoute une couche de sécurité supplémentaire en demandant une preuve d'identité supplémentaire, et l'utilisation de mots de passe uniques pour chaque compte réduit le risque d'accès non autorisé en cas de fuite de données.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q3', selected, result.textContent, true);
        document.getElementById("btn-valider-q3").style.display = "none";
        document.getElementById("btn-suivant-q3").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Évitez de partager et de réutiliser les mêmes mots de passe. Il faut plutôt ajouter une couche de sécurité supplémentaire avec l'authentification à deux facteurs (2FA), et utiliser un mot de passe unique pour chaque compte.";
        result.style.color = "red";
        recordQuestionReview('q3', selected, result.textContent, false);
        document.getElementById("btn-valider-q3").style.display = "none";
        setTimeout(() => showNextQuestion('q3'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 4
function checkQ4() {
    const selected = Array.from(document.querySelectorAll('input[name="q4"]:checked'))
                          .map(el => el.value);

  const correct = ["urgent"]; //La bonne réponse: demande urgente

    const result = document.getElementById("result-q4");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Une demande urgente est un indicateur classique d'une tentative de phishing, car les attaquants cherchent à créer un sentiment d'urgence pour inciter les victimes à agir rapidement et sans réfléchir.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q4', selected, result.textContent, true);
        document.getElementById("btn-valider-q4").style.display = "none";
        document.getElementById("btn-suivant-q4").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Les attaquants cherchent à vous dépechez.";
        result.style.color = "red";
        recordQuestionReview('q4', selected, result.textContent, false);
        document.getElementById("btn-valider-q4").style.display = "none";
        setTimeout(() => showNextQuestion('q4'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 5
function checkQ5() {
    const selected = Array.from(document.querySelectorAll('input[name="q5"]:checked'))
                          .map(el => el.value);

  const correct = ["maj", "permissions"]; //Bonnes réponses: mises à jour + restreindre permissions

    const result = document.getElementById("result-q5");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    if (arraysEqual(selected, correct)) {
        score ++;
        result.textContent = "Bonne réponse ! Maintenir les systèmes à jour avec les derniers correctifs de sécurité et restreindre les permissions des applications sont des mesures essentielles pour réduire la surface d'attaque et prévenir les accès non autorisés.";
        result.style.color = "green";
        recordQuestionReview('q5', selected, result.textContent, true);
        document.getElementById("btn-valider-q5").style.display = "none";
        document.getElementById("btn-suivant-q5").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. La localisation et le Bluetooth activés en permanence peut être risqué. Maintenez les systèmes à jour avec les derniers correctifs de sécurité et restreignez les permissions des applications pour réduire les risques.";
        result.style.color = "red";
        recordQuestionReview('q5', selected, result.textContent, false);
        document.getElementById("btn-valider-q5").style.display = "none";
        setTimeout(() => showNextQuestion('q5'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 6
function checkQ6() {
    const selected = Array.from(document.querySelectorAll('input[name="q6"]:checked'))
                          .map(el => el.value);

  const correct = ["stocker"]; //La bonne réponse: stocker et générer des mots de passe

    const result = document.getElementById("result-q6");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Un gestionnaire de mots de passe permet de stocker et de générer des mots de passe forts et uniques pour chaque compte, ce qui améliore considérablement la sécurité en réduisant le risque de réutilisation de mots de passe et en facilitant la gestion des identifiants.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q6', selected, result.textContent, true);
        document.getElementById("btn-valider-q6").style.display = "none";
        document.getElementById("btn-suivant-q6").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Un gestionnaire de mots de passe est comme un coffre-fort pour vos mots de passe.";
        result.style.color = "red";
        recordQuestionReview('q6', selected, result.textContent, false);
        document.getElementById("btn-valider-q6").style.display = "none";
        setTimeout(() => showNextQuestion('q6'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 7
function checkQ7() {
    const selected = Array.from(document.querySelectorAll('input[name="q7"]:checked'))
                          .map(el => el.value);

  const correct = ["rdp"]; //La bonne réponse: des connexions RDP inhabituelles entre machines internes, indicateur d'une attaque par mouvement latéral

    const result = document.getElementById("result-q7");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Des connexions RDP inhabituelles entre machines internes peuvent être un indicateur d'une attaque par mouvement latéral, où un attaquant qui a compromis une machine tente de se déplacer latéralement à travers le réseau pour accéder à d'autres ressources.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q7', selected, result.textContent, true);
        document.getElementById("btn-valider-q7").style.display = "none";
        document.getElementById("btn-suivant-q7").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. L'indicateur qui permet le mieux de détecter une attaque par mouvement latéral dans un réseau d'entreprise est la présence de connexions RDP inhabituelles entre machines internes.";
        result.style.color = "red";
        recordQuestionReview('q7', selected, result.textContent, false);
        document.getElementById("btn-valider-q7").style.display = "none";
        setTimeout(() => showNextQuestion('q7'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 8
function checkQ8() {
    const selected = Array.from(document.querySelectorAll('input[name="q8"]:checked'))
                          .map(el => el.value);

  const correct = ["https", "icone"]; //Bonnes réponses: HTTPS et icône cadenas

    const result = document.getElementById("result-q8");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! L'utilisation de HTTPS et l'indication d'un icône cadenas dans la barre d'adresse sont des signes que la connexion est sécurisée.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q8', selected, result.textContent, true);
        document.getElementById("btn-valider-q8").style.display = "none";
        document.getElementById("btn-suivant-q8").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Voyez ce qui est présent sur le site (https et icône cadenas).";
        result.style.color = "red";
        recordQuestionReview('q8', selected, result.textContent, false);
        document.getElementById("btn-valider-q8").style.display = "none";
        setTimeout(() => showNextQuestion('q8'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 9
function checkQ9() {
    const selected = Array.from(document.querySelectorAll('input[name="q9"]:checked'))
                          .map(el => el.value);

  const correct = ["trafic", "inconnus", "ports"]; //Les bonnes réponses: trafic sortant inhabituel vers des pays étrangers, des appareils inconnus apparaissent sur le réseau, des ports ouverts inattendus sur plusieurs machines

    const result = document.getElementById("result-q9");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Un trafic sortant inhabituel vers des pays étrangers, des appareils inconnus apparaissant sur le réseau, et des ports ouverts inattendus sur plusieurs machines sont tous des indicateurs potentiels d'une compromission du réseau.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q9', selected, result.textContent, true);
        document.getElementById("btn-valider-q9").style.display = "none";
        document.getElementById("btn-suivant-q9").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Des indicateurs potentiels d'une compromission du réseau incluent un trafic sortant inhabituel vers des pays étrangers, des appareils inconnus apparaissant sur le réseau, et des ports ouverts inattendus sur plusieurs machines.";
        result.style.color = "red";
        recordQuestionReview('q9', selected, result.textContent, false);
        document.getElementById("btn-valider-q9").style.display = "none";
        setTimeout(() => showNextQuestion('q9'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 10
function checkQ10() {
    const selected = Array.from(document.querySelectorAll('input[name="q10"]:checked'))
                          .map(el => el.value);

  const correct = ["permissions", "editeur", "taille"]; //Bonnes réponses indicatrices

    const result = document.getElementById("result-q10");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Des permissions inhabituelles, un éditeur inconnu, ou une taille de fichier anormalement grande ou petite peuvent être des indicateurs d'une compromission ou d'une activité malveillante.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q10', selected, result.textContent, true);
        document.getElementById("btn-valider-q10").style.display = "none";
        document.getElementById("btn-suivant-q10").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Pensez à ce qui semble le plus suspect, un éditeur inconnu, des permissions inhabituelles, ou une taille de fichier anormalement grande ou petite.";
        result.style.color = "red";
        recordQuestionReview('q10', selected, result.textContent, false);
        document.getElementById("btn-valider-q10").style.display = "none";
        setTimeout(() => showNextQuestion('q10'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 11
function checkQ11() {
    const selected = Array.from(document.querySelectorAll('input[name="q11"]:checked'))
                          .map(el => el.value);

  const correct = ["least"]; //La bonne réponse: moindre privilège

    const result = document.getElementById("result-q11");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Le principe du moindre privilège consiste à accorder aux utilisateurs uniquement les permissions nécessaires pour accomplir leurs tâches, réduisant ainsi les risques.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q11', selected, result.textContent, true);
        document.getElementById("btn-valider-q11").style.display = "none";
        document.getElementById("btn-suivant-q11").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Le principe du moindre privilège consiste à accorder aux utilisateurs uniquement les permissions nécessaires pour accomplir leurs tâches, réduisant ainsi les risques.";
        result.style.color = "red";
        recordQuestionReview('q11', selected, result.textContent, false);
        document.getElementById("btn-valider-q11").style.display = "none";
        setTimeout(() => showNextQuestion('q11'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 12
function checkQ12() {
    const selected = Array.from(document.querySelectorAll('input[name="q12"]:checked'))
                          .map(el => el.value);

  const correct = ["local+cloud"]; //La bonne réponse: copie locale + cloud chiffré

    const result = document.getElementById("result-q12");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Stocker une copie locale des données et une copie dans le cloud chiffré offre une protection contre la perte de données due à des incidents locaux (comme un vol ou un incendie) tout en assurant que les données sont sécurisées contre les accès non autorisés grâce au chiffrement.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q12', selected, result.textContent, true);
        document.getElementById("btn-valider-q12").style.display = "none";
        document.getElementById("btn-suivant-q12").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Il est recommandé de stocker une copie locale des données et une copie dans le cloud chiffré pour assurer la sécurité et la disponibilité des données.";
        result.style.color = "red";
        recordQuestionReview('q12', selected, result.textContent, false);
        document.getElementById("btn-valider-q12").style.display = "none";
        setTimeout(() => showNextQuestion('q12'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 13
function checkQ13() {
    const selected = Array.from(document.querySelectorAll('input[name="q13"]:checked'))
                          .map(el => el.value);

  const correct = ["changer"]; //La bonne réponse: révoquer les sessions et changer les mots de passe

    const result = document.getElementById("result-q13");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Révoquer les sessions et changer les mots de passe est une mesure de sécurité importante en cas de compromission.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q13', selected, result.textContent, true);
        document.getElementById("btn-valider-q13").style.display = "none";
        document.getElementById("btn-suivant-q13").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Révoquer les sessions et changer les mots de passe est une mesure de sécurité importante en cas de compromission.";
        result.style.color = "red";
        recordQuestionReview('q13', selected, result.textContent, false);
        document.getElementById("btn-valider-q13").style.display = "none";
        setTimeout(() => showNextQuestion('q13'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 14
function checkQ14() {
    const selected = Array.from(document.querySelectorAll('input[name="q14"]:checked'))
                          .map(el => el.value);

  const correct = ["protection"]; //La bonne réponse: protéger les données en cas de vol

    const result = document.getElementById("result-q14");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Protéger les données en cas de vol est crucial pour éviter que des informations sensibles ne tombent entre de mauvaises mains, ce qui peut entraîner des conséquences graves comme le vol d'identité.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q14', selected, result.textContent, true);
        document.getElementById("btn-valider-q14").style.display = "none";
        document.getElementById("btn-suivant-q14").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Protéger vos données.";
        result.style.color = "red";
        recordQuestionReview('q14', selected, result.textContent, false);
        document.getElementById("btn-valider-q14").style.display = "none";
        setTimeout(() => showNextQuestion('q14'), 2000);
    }
    updateScore();
}

//Q15 / Q16 / Q17
//Bonnes réponses : clé = bloc gauche (A/B/C), valeur = bloc droit attendu (1/2/3)
const configs = {
  15: { correctMap: { A: "1", B: "2", C: "3" } },
  16: { correctMap: { A: "3", B: "2", C: "1" } },
  17: { correctMap: { A: "2", B: "1", C: "3" } },
};

//Appelée quand toutes les connexions d'une question sont correctes
//À compléter avec une explication personnalisée par question
function onBonneReponse15(result) {
  result.innerHTML = "Bonne réponse !<br><small>Les données personnelles sont des informations permettant d'identifier une personne, même indirectement. Les données sensibles sont des catégories nécessitant une protection renforcée (santé, opinions, biométrie...). Les données confidentielles internes sont des informations métier non publiques (procédures, contrats, architecture IT).</small>";
}

function onBonneReponse16(result) {
  result.innerHTML = "Bonne réponse !<br><small>Le principe du moindre privilège consiste à limiter les accès pour réduire l'impact d'un compte compromis. La journalisation centralisée est une détection plus rapide d'anomalies et corrélations d'évènements. La sensibilisation continue est une réduction du risque humain grâce à des rappels réguliers et contextualisés.</small>";
}

function onBonneReponse17(result) {
  result.innerHTML = "Bonne réponse !<br><small>Le VPN (réseau virtuel) chiffre le traffic entre votre appareil et un serveur distant, il masque votre IP mais ne rend pas anonyme. Le chiffrement de bout en bout (E2EE) garantit que seuls l'expéditeur et le destinataire peuvent lire le message, même le serveur intermédiaire ne peut pas le déchiffrer. Le certificat SSL/TLS (cadenas HTTPS) chiffre les données en transit entre votre navigateur et le site web, il ne garantit pas que le site est légitime.</small>";
}

function onMauvaiseReponse15(result) {
  result.innerHTML = "Mauvaise réponse !<br><small>Les données personnelles sont des informations permettant d'identifier une personne, même indirectement. Les données sensibles sont des catégories nécessitant une protection renforcée (santé, opinions, biométrie...). Les données confidentielles internes sont des informations métier non publiques (procédures, contrats, architecture IT).</small>";
}

function onMauvaiseReponse16(result) {
  result.innerHTML = "Mauvaise réponse !<br><small>Le principe du moindre privilège consiste à limiter les accès pour réduire l'impact d'un compte compromis. La journalisation centralisée est une détection plus rapide d'anomalies et corrélations d'évènements. La sensibilisation continue est une réduction du risque humain grâce à des rappels réguliers et contextualisés.</small>";
}

function onMauvaiseReponse17(result) {
  result.innerHTML = "Mauvaise réponse !<br><small>Le VPN (réseau virtuel) chiffre le traffic entre votre appareil et un serveur distant, il masque votre IP mais ne rend pas anonyme. Le chiffrement de bout en bout (E2EE) garantit que seuls l'expéditeur et le destinataire peuvent lire le message. Le certificat SSL/TLS (cadenas HTTPS) chiffre les données en transit entre votre navigateur et le site web, il ne garantit pas que le site est légitime.</small>";
}

//Regroupe les callbacks par numéro de question pour les appeler dans la boucle
const onBonneReponse = {
  15: onBonneReponse15,
  16: onBonneReponse16,
  17: onBonneReponse17,
};

const onMauvaiseReponse = {
  15: onMauvaiseReponse15,
  16: onMauvaiseReponse16,
  17: onMauvaiseReponse17,
};

//Canvas

//Ajuste la taille du canvas à celle de son conteneur
function resizeCanvas(n) {
  const s = state[n];
  s.canvas.width  = document.getElementById(`conteneur${n}`).clientWidth;
  s.canvas.height = document.getElementById(`conteneur${n}`).clientHeight;
}

//Efface et redessine toutes les connexions (bleu = correct, rouge = incorrect)
function redraw(n) {
  const { canvas, ctx, connexions } = state[n];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 3;

  connexions.forEach(c => {
    const blocG = document.querySelector(`.gauche${n} .bloc${n}[data-id="${c.left}"]`);
    const blocD = document.querySelector(`.droite${n} .bloc${n}[data-id="${c.right}"]`);
    const cont  = document.getElementById(`conteneur${n}`).getBoundingClientRect();

    const center = el => {
      const r = el.getBoundingClientRect();
      return { x: r.left - cont.left + r.width / 2, y: r.top - cont.top + r.height / 2 };
    };

    ctx.strokeStyle = c.correct === false ? "#e74c3c" : "#3498db";
    ctx.beginPath();
    ctx.moveTo(...Object.values(center(blocG)));
    ctx.lineTo(...Object.values(center(blocD)));
    ctx.stroke();
  });
}


[15, 16, 17].forEach(n => {
  const canvas = document.getElementById(`lignes${n}`);
  state[n] = { canvas, ctx: canvas.getContext("2d"), connexions: [], selected: null };

  resizeCanvas(n);
  window.addEventListener("resize", () => { resizeCanvas(n); redraw(n); });

  //Clic sur un bloc gauche : le sélectionne comme point de départ
  document.querySelectorAll(`.gauche${n} .bloc${n}`).forEach(bloc => {
    bloc.addEventListener("click", () => {
      document.querySelectorAll(`.gauche${n} .bloc${n}`).forEach(b => b.classList.remove("selected"));
      bloc.classList.add("selected");
      state[n].selected = bloc.dataset.id;
    });
  });

  //Clic sur un bloc droit : crée la connexion avec le bloc gauche sélectionné
  document.querySelectorAll(`.droite${n} .bloc${n}`).forEach(bloc => {
    bloc.addEventListener("click", () => {
      if (!state[n].selected) return;

      //Remplace une éventuelle connexion existante pour ce bloc gauche
      state[n].connexions = state[n].connexions.filter(c => c.left !== state[n].selected);
      state[n].connexions.push({ left: state[n].selected, right: bloc.dataset.id, correct: null });

      document.querySelectorAll(`.gauche${n} .bloc${n}`).forEach(b => b.classList.remove("selected"));
      state[n].selected = null;
      redraw(n);
    });
  });

  //Validation : vérifie chaque connexion et met à jour score + affichage
  document.getElementById(`btn-valider-q${n}`).addEventListener("click", () => {
    const { correctMap } = configs[n];
    let bonnes = 0;

    state[n].connexions.forEach(c => {
      c.correct = c.right === correctMap[c.left];
      if (c.correct) bonnes++;
    });
    redraw(n); //Redessine en rouge (faux) ou bleu (vrai)

    const result = document.getElementById(`result-q${n}`);
    if (bonnes === 3) {
      onBonneReponse[n](result); //Appelle la fonction spécifique à la question
      result.style.color = "green";
      score++;
      recordQuestionReview(`q${n}`, [], result.textContent, true);
      document.getElementById(`btn-valider-q${n}`).style.display = "none";
      document.getElementById(`btn-suivant-q${n}`).style.display = "inline-block";
    } else {
      onMauvaiseReponse[n](result); //Appelle la fonction spécifique à la question
      result.style.color = "red";
      recordQuestionReview(`q${n}`, [], result.textContent, false);
      document.getElementById(`btn-valider-q${n}`).style.display = "none";
      setTimeout(() => showNextQuestion(`q${n}`), 2000);
    }
    updateScore();
  });
});

//Fonction qui permet de vérifier la réponse de la question 18
function checkQ18() {
    const selected = Array.from(document.querySelectorAll('input[name="q18"]:checked'))
                          .map(el => el.value);

  const correct = ["compromission"]; //La bonne réponse: la compromission de la clé maître donnant accès à l'ensemble du coffre

    const result = document.getElementById("result-q18");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! La compromission de la clé maître donnant accès à l'ensemble du coffre est un risque majeur en matière de sécurité.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q18', selected, result.textContent, true);
        document.getElementById("btn-valider-q18").style.display = "none";
        document.getElementById("btn-suivant-q18").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Le risque majeur en matière de sécurité est la compromission de la clé maître donnant accès à l'ensemble du coffre.";
        result.style.color = "red";
        recordQuestionReview('q18', selected, result.textContent, false);
        document.getElementById("btn-valider-q18").style.display = "none";
        setTimeout(() => showNextQuestion('q18'), 2000);
    }
    updateScore();
}

// Envoi du score au serveur (à appeler à la fin du questionnaire)
async function envoyerScore(nom, score, niveau, total) {
  try {
    await fetch('http://localhost:3001/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, score, niveau, total })
    });
    console.log('Score envoyé avec succès');
  } catch (error) {
    console.error('Erreur envoi score :', error);
  }
}


function updateProgress(questionId) {
  const progress = document.getElementById('progress');
  const progressText = document.getElementById('progress-text');
  const currentIndex = questionOrder.indexOf(questionId) + 1;

  if (progress && progressText && currentIndex > 0) {
    progress.value = currentIndex;
    progressText.textContent = `${currentIndex}/${questionOrder.length}`;
  }
}