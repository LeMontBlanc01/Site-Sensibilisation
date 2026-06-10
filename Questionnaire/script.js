console.log("JS chargé !");
let score = 0;
const state = {};
let quizReview = [];
let quizFlags = {};
let quizAnswers = {};
let questionOrder = [];
let joueurNom = "Anonyme";

try {
  const nom = prompt("Entrez votre prénom :");
  if (nom) joueurNom = nom;
} catch (e) {
  console.warn("prompt() not available:", e);
}

const pageName = window.location.pathname.split('/').pop().toLowerCase();

const pageConfigs = {
  'facile.html': {
    niveau: 'Facile',
    lastQuizPage: 'facile.html',
    flagStorageKey: 'quizFlags_facile',
    quizAnswersKey: 'quizAnswers_facile',
  },
  'moyen.html': {
    niveau: 'moyen',
    lastQuizPage: 'moyen.html',
    flagStorageKey: 'quizFlags_moyen',
    quizAnswersKey: 'quizAnswers_moyen',
  },
'difficile.html': {
    niveau: 'Difficile',
    lastQuizPage: 'difficile.html',
    flagStorageKey: 'quizFlags_difficile',
    quizAnswersKey: 'quizAnswers_difficile'
  }
};


const pageConfig = pageConfigs[pageName] || pageConfigs['facile.html'];


// Fonction pour charger l'état des flags de révision depuis le localStorage
function loadQuizFlags() {
  try {
    quizFlags = JSON.parse(localStorage.getItem(pageConfig.flagStorageKey) || '{}');
  } catch (e) {
    quizFlags = {};
    console.error('Impossible de charger l\'état des flags', e);
  }
}

// Fonction pour charger l'état sauvegardé du quiz (score, review, réponses sélectionnées) depuis le localStorage
function loadSavedQuizState() {
  try {
    quizReview = JSON.parse(localStorage.getItem('quizReview') || '[]');
  } catch (e) {
    quizReview = [];
  }
  try {
    quizAnswers = JSON.parse(localStorage.getItem(pageConfig.quizAnswersKey) || '{}');
  } catch (e) {
    quizAnswers = {};
  }
  const storedScore = parseInt(localStorage.getItem('quizScore'), 10);
  if (!Number.isNaN(storedScore)) {
    score = storedScore;
  }
}

// Fonction pour sauvegarder les réponses sélectionnées par l'utilisateur dans le localStorage, afin de les restaurer en cas de retour à une question déjà répondue
function saveQuizAnswers() {
  localStorage.setItem(pageConfig.quizAnswersKey, JSON.stringify(quizAnswers));
}

// Fonction pour restaurer les réponses sélectionnées par l'utilisateur lorsqu'il revient sur une question déjà répondue, en cochant les cases correspondantes
function restoreSavedAnswers(questionId) {
  const selected = quizAnswers[questionId];
  if (!Array.isArray(selected)) return;
  const inputs = document.querySelectorAll(`input[name="${questionId}"]`);
  inputs.forEach(input => {
    input.checked = selected.includes(input.value);
  });
}


// Fonction pour éditer le contenu d'une question, utilisée depuis la page de résultats pour permettre à l'utilisateur de corriger une question mal comprise
function editQuizQuestion(questionId, newContent) {
  const question = document.getElementById(questionId);
  if (question) {
    question.innerHTML = newContent;
  }
}

// Fonction pour sauvegarder l'état des flags de révision dans le localStorage, afin de les restaurer lors du prochain chargement de la page
function saveQuizFlags() {
  localStorage.setItem(pageConfig.flagStorageKey, JSON.stringify(quizFlags));
}

// Fonction pour mettre à jour l'interface d'une question en fonction de son état de flag de révision, en changeant le texte du bouton et la classe CSS de la question
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

// Fonction pour initialiser les boutons de flag de révision sur chaque question, en les créant s'ils n'existent pas et en configurant leur comportement au clic pour basculer l'état de flag de la question et mettre à jour l'interface en conséquence
function initFlagButtons() {
  document.querySelectorAll('.question').forEach(question => {
    const questionId = question.id;

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

      if (validerBtn && validerBtn.parentNode) {
        validerBtn.parentNode.insertBefore(flagBtn, validerBtn.nextSibling);
      } else {
        question.appendChild(flagBtn);
      }
    }

    const btn = question.querySelector('.flag-btn');
    if (btn) {
      btn.textContent = Boolean(quizFlags[questionId]) ? 'Retirer le marqueur' : 'Marquer cette question à revoir';
      btn.setAttribute('aria-pressed', String(Boolean(quizFlags[questionId])));
    }
    updateFlagUI(questionId);
  });
}

// Ordre aléatoire des questions
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
  if (['q15', 'q16', 'q17'].includes(questionId)) return; // Les questions ou il faut relier des éléments ne sont pas mélangées

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
  // Déterminer si on arrive en mode édition depuis les résultats
  const isEditMode = localStorage.getItem('backToResults') === '1' || 
                     localStorage.getItem('editQuestionId');

  if (!isEditMode) {
    // Nouvelle partie: on repart de zéro
    score = 0;
    quizReview = [];
    quizAnswers = {};
    quizFlags = {};
    localStorage.removeItem('quizReview');
    localStorage.removeItem('quizScore');
    localStorage.removeItem(pageConfig.quizAnswersKey);
    localStorage.removeItem(pageConfig.flagStorageKey);
  } else {
    // Retour depuis résultats pour éditer: on restaure l'état
    loadSavedQuizState();
    loadQuizFlags();
  }

  initFlagButtons();
  initRandomQuestions();
});

// Si on est revenu depuis la page de résultats pour éditer une question,
// afficher directement cette question
window.addEventListener('load', () => {
  const editQuestionId = localStorage.getItem('editQuestionId');
  if (editQuestionId) {
    // Afficher la question demandée
    try {
      showQuestion(editQuestionId);
      restoreSavedAnswers(editQuestionId);
    } catch (e) {
      console.warn('Impossible d\'afficher la question demandée:', editQuestionId, e);
    }
  }
});

async function goToResults() {
  localStorage.setItem('lastQuizPage', pageConfig.lastQuizPage);
  // Vérifier que le score affiché correspond au score calculé
  const scoreEl = document.getElementById('score');
  let displayed = score;
  if (scoreEl) {
    const parsed = parseInt((scoreEl.textContent || '').replace(/\D/g, ''), 10);
    if (!Number.isNaN(parsed)) displayed = parsed;
  }
  if (displayed !== score) {
    score = displayed;
    updateScore();
  }

  const confirmed = confirm('Voulez-vous définitivement valider vos réponses et voir votre score ?');
    if (!confirmed) return;

    try {
      const response = await fetch('http://localhost:3001/api/verify-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            nom: joueurNom, 
            niveau: pageConfig.niveau, 
            reponsesUtilisateur: quizAnswers 
        })
      });

    const bilan = await response.json();

    // On stocke le résultat renvoyé par le serveur dans le localStorage
    localStorage.setItem('quizScore', String(bilan.score));
    localStorage.setItem('quizNiveau', pageConfig.niveau);
    localStorage.setItem('quizNom', joueurNom);
    
    // On stocke le détail de la correction pour l'afficher sur la page de résultats
    localStorage.setItem('quizCorrection', JSON.stringify(bilan.details));

    // Redirection
    window.location.href = 'resultats.html';

  } catch (error) {
    console.error("Erreur lors de l'envoi du quiz :", error);
    alert("Impossible de joindre le serveur. Vos réponses n'ont pas pu être corrigées.");
  }
}

// Affiche la question dont l'id est passé en paramètre et cache les autres, tout en mettant à jour la barre de progression et en redimensionnant les canvas si nécessaire
function showQuestion(id) {
  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');  // On récupère toutes les divs de la classe "question" et on les cache
  document.getElementById(id).style.display = 'block';  // On affiche uniquement la question dont l'id est passé en paramètre
  
  // Vide les messages de résultat quand on change de question
  ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13','q14','q15', 'q16', 'q17','q18'].forEach(qid => {
    if (id !== qid) {
      const r = document.getElementById(`result-${qid}`);
      if (r) r.textContent = '';
    }
  });

  // Les canvas ont une taille 0 quand leur question est cachée,
  // il faut donc les redimensionner au moment où elles deviennent visibles
  const match = id.match(/^q(15|16|17)$/);
  if (match) {
    const n = match[1];
    resizeCanvas(n);
    redraw(n);
  }

  restoreSavedAnswers(id);
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
  quizAnswers[questionId] = Array.isArray(selected) ? selected : [];
  saveQuizAnswers();
  // Si on est en mode édition depuis la page de résultats, revenir automatiquement
  if (localStorage.getItem('backToResults') === '1') {
    localStorage.removeItem('backToResults');
    localStorage.removeItem('editQuestionId');
    window.location.href = 'resultats.html';
  }
}

function showResult(id) {
  document.querySelectorAll('.result').forEach(r => r.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  updateProgress(id);
}

async function checkQuestion(questionId) {
  const selected = Array.from(document.querySelectorAll(`input[name="${questionId}"]:checked`))
                        .map(el => el.value);

  const niveauActuel = pageConfig.niveau; 
  const result = document.getElementById(`result-${questionId}`);
  
  try {
    // 2. On demande la correction au serveur
    const response = await fetch('http://localhost:3001/api/verify-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        niveau: pageConfig.niveau,
        questionId: questionId,
        reponsesUtilisateur: selected,
      })
    });

    const data = await response.json();

    result.textContent = data.explication;

    if (data.correct) {
      result.style.color = "green";
      score++; 
      recordQuestionReview(questionId, selected, data.explication, true);
      document.getElementById(`btn-valider-${questionId}`).style.display = "none";
      document.getElementById(`btn-suivant-${questionId}`).style.display = "inline-block";
    } else {
      result.style.color = "red";
      recordQuestionReview(questionId, selected, data.explication, false);
      document.getElementById(`btn-valider-${questionId}`).style.display = "none";
      setTimeout(() => showNextQuestion(questionId), 2000);
    }

    updateScore();

  } catch (error) {
    console.error("Erreur lors de la vérification de la question :", error);
    result.textContent = "Erreur de connexion avec le serveur.";
    result.style.color = "orange";
  }
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
    const niveau = pageConfig.niveau;
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

//Fonction qui permet de vérifier la réponse de la question 1
function checkQ1() {
  checkQuestion('q1');
}

//Fonction qui permet de vérifier la réponse de la question 2
function checkQ2() {
  checkQuestion('q2');
}

// Fonction qui permet de vérifier la réponse de la question 3
function checkQ3() {
  checkQuestion('q3');
}

// Fonction qui permet de vérifier la réponse de la question 4
function checkQ4() {
  checkQuestion('q4');
}

// Fonction qui permet de vérifier la réponse de la question 5
function checkQ5() {
  checkQuestion('q5');
}

// Fonction qui permet de vérifier la réponse de la question 6
function checkQ6() {
  checkQuestion('q6');
}

// Fonction qui permet de vérifier la réponse de la question 7
function checkQ7() {
  checkQuestion('q7');
}

// Fonction qui permet de vérifier la réponse de la question 8
function checkQ8() {
  checkQuestion('q8');
}

// Fonction qui permet de vérifier la réponse de la question 9
function checkQ9() {
  checkQuestion('q9');
}

// Fonction qui permet de vérifier la réponse de la question 10
function checkQ10() {
  checkQuestion('q10');
}

// Fonction qui permet de vérifier la réponse de la question 11
function checkQ11() {
  checkQuestion('q11');
}

// Fonction qui permet de vérifier la réponse de la question 12
function checkQ12() {
  checkQuestion('q12');
}

// Fonction qui permet de vérifier la réponse de la question 13
function checkQ13() {
  checkQuestion('q13');
}

// Fonction qui permet de vérifier la réponse de la question 14
function checkQ14() {
  checkQuestion('q14');
}

function checkQ18() {
  checkQuestion('q18');
}

//Q15 / Q16 / Q17
//Bonnes réponses : clé = bloc gauche (A/B/C), valeur = bloc droit attendu (1/2/3)
const configs = pageConfig.matchingQuestions;


// Canvas
// Ajuste la taille du canvas à celle de son conteneur
function resizeCanvas(n) {
  const s = state[n];
  s.canvas.width  = document.getElementById(`conteneur${n}`).clientWidth;
  s.canvas.height = document.getElementById(`conteneur${n}`).clientHeight;
}

// Efface et redessine toutes les connexions (bleu = correct, rouge = incorrect)
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

// Initialise les interactions pour les questions de type "relier les éléments", en configurant les clics sur les blocs gauche et droit pour créer des connexions, et le bouton de validation pour vérifier les connexions et afficher les résultats
window.addEventListener('load', () => {
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
    document.getElementById(`btn-valider-q${n}`).addEventListener("click", async () => {
      const connexionsUser = state[n].connexions;
      const niveauActuel = pageConfig.niveau;
      const result = document.getElementById(`result-q${n}`);

      try {
        const response = await fetch('http://localhost:3001/api/verify-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            niveau: niveauActuel,
            questionId: `q${n}`,
            reponsesUtilisateur: connexionsUser
          })
        });

        const data = await response.json();
        result.textContent = data.explication;

        if (data.correct) {
          result.style.color = "green";
          score++;
          recordQuestionReview(`q${n}`, [], data.explication, true);
          document.getElementById(`btn-valider-q${n}`).style.display = "none";
          document.getElementById(`btn-suivant-q${n}`).style.display = "inline-block";
        } else {
          result.style.color = "red";
          recordQuestionReview(`q${n}`, [], data.explication, false);
          document.getElementById(`btn-valider-q${n}`).style.display = "none";
          setTimeout(() => showNextQuestion(`q${n}`), 2000);
        }
        
        updateScore();

      } catch (error) {
        console.error("Erreur canvas :", error);
      }
    });
  });
});

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

// Met à jour la barre de progression et le texte associé
function updateProgress(questionId) {
  const progress = document.getElementById('progress');
  const progressText = document.getElementById('progress-text');
  const currentIndex = questionOrder.indexOf(questionId) + 1;

  if (progress && progressText && currentIndex > 0) {
    progress.value = currentIndex;
    progressText.textContent = `${currentIndex}/${questionOrder.length}`;
  }
}