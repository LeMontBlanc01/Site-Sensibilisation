console.log("JS chargé !"); // Affiche un message dans la console pour confirmer que le fichier JS est bien chargé
let score = 0;
const joueurNom = prompt("Entrez votre prénom :") || "Anonyme";
const quizNiveau = "Difficile";
const state = {};   //État de chaque question : canvas, contexte, connexions tracées, bloc gauche sélectionné
let quizReview = [];

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

window.addEventListener('load', initRandomQuestions); // Initialise les questions aléatoires au chargement de la page

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
    const selected = Array.from(document.querySelectorAll('input[name="q1"]:checked'))  //Récupère toutes les cases cochées de la question 1 et on prend leur valeur
                          .map(el => el.value);

    const correct = ["sslv3"]; //La bonne réponse

    const result = document.getElementById("result-q1");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Utiliser un protocole de chiffrement obsolète comme SSLv3 expose les données à des vulnérabilités connues, ce qui peut permettre à des attaquants d'intercepter et de déchiffrer les informations sensibles transmises entre le client et le serveur.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q1', selected, result.textContent, true);
        document.getElementById("btn-valider-q1").style.display = "none";
        document.getElementById("btn-suivant-q1").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Il s'agit d'un protocole de chiffrement obsolète qui se nomme SSLv3.";
        result.style.color = "red";
        recordQuestionReview('q1', selected, result.textContent, false);
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
    const niveau = "Difficile";
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

    const correct = ["sortie"];  //La bonne réponse

    const result = document.getElementById("result-q2");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Échapper les données avant l'affichage côté sortie est une mesure de sécurité essentielle pour prévenir les attaques de type cross-site scripting (XSS), car elle permet de neutraliser les caractères spéciaux et les scripts malveillants qui pourraient être injectés dans une page web, protégeant ainsi les utilisateurs contre l'exécution de code malveillant dans leur navigateur.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q2', selected, result.textContent, true);
        document.getElementById("btn-valider-q2").style.display = "none";
        document.getElementById("btn-suivant-q2").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Échapper les données avant l'affichage côté sortie est une mesure de sécurité essentielle pour prévenir les attaques de type cross-site scripting (XSS).";
        result.style.color = "red";
        recordQuestionReview('q2', selected, result.textContent, false);
        setTimeout(() => showNextQuestion('q2'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 3
function checkQ3() {
    const selected = Array.from(document.querySelectorAll('input[name="q3"]:checked'))
                          .map(el => el.value);

    const correct = ["param", "validation"]; //Les bonnes réponses

    const result = document.getElementById("result-q3");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! La validation côté serveur est essentielle pour garantir la sécurité des applications web, car elle permet de vérifier et de filtrer les données entrantes, empêchant ainsi les attaques telles que l'injection SQL, les scripts intersites (XSS) et d'autres formes de manipulation de données malveillantes.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q3', selected, result.textContent, true);
        document.getElementById("btn-valider-q3").style.display = "none";
        document.getElementById("btn-suivant-q3").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Il s'agit de deux étapes clés pour sécuriser les données entrantes dans une application web. La validation côté serveur et utiliser des requêtes paramétrées.";
        result.style.color = "red";
        recordQuestionReview('q3', selected, result.textContent, false);
        setTimeout(() => showNextQuestion('q3'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 4
function checkQ4() {
    const selected = Array.from(document.querySelectorAll('input[name="q4"]:checked'))
                          .map(el => el.value);

    const correct = ["oneway"]; //La bonne réponse

    const result = document.getElementById("result-q4");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Utiliser une fonction de hachage à sens unique pour stocker les mots de passe est une pratique de sécurité essentielle, car elle permet de protéger les mots de passe des utilisateurs en les transformant en une valeur hachée qui ne peut pas être inversée, ce qui rend extrêmement difficile pour les attaquants de récupérer les mots de passe d'origine même s'ils parviennent à accéder à la base de données.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q4', selected, result.textContent, true);
        document.getElementById("btn-valider-q4").style.display = "none";
        document.getElementById("btn-suivant-q4").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Utiliser une fonction de hachage à sens unique pour stocker les mots de passe est une pratique de sécurité essentielle, car elle permet de protéger les mots de passe des utilisateurs en les transformant en une valeur hachée qui ne peut pas être inversée, ce qui rend extrêmement difficile pour les attaquants de récupérer les mots de passe d'origine même s'ils parviennent à accéder à la base de données.";
        result.style.color = "red";
        recordQuestionReview('q4', selected, result.textContent, false);
        setTimeout(() => showNextQuestion('q4'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 5
function checkQ5() {
    const selected = Array.from(document.querySelectorAll('input[name="q5"]:checked'))
                          .map(el => el.value);

    const correct = ["unique"]; //La bonne réponse

    const result = document.getElementById("result-q5");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    if (arraysEqual(selected, correct)) {
        score ++;
        recordQuestionReview('q5', selected, result.textContent, true);
        result.textContent = "Bonne réponse ! La caractéristique qui distingue un jeton anti-CSRF efficace est qu'il doit être unique pour chaque session ou chaque requête, ce qui permet de garantir que les requêtes proviennent bien de l'utilisateur légitime et de prévenir les attaques de type cross-site request forgery (CSRF) en rendant difficile pour les attaquants de prédire ou de réutiliser des jetons valides.";
        result.style.color = "green";
        document.getElementById("btn-valider-q5").style.display = "none";
        document.getElementById("btn-suivant-q5").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. La caractéristique qui distingue un jeton anti-CSRF efficace est qu'il doit être unique pour chaque session ou chaque requête, ce qui permet de garantir que les requêtes proviennent bien de l'utilisateur légitime et de prévenir les attaques de type cross-site request forgery (CSRF) en rendant difficile pour les attaquants de prédire ou de réutiliser des jetons valides.";
        result.style.color = "red";
        recordQuestionReview('q5', selected, result.textContent, false);
        setTimeout(() => showNextQuestion('q5'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 6
function checkQ6() {
    const selected = Array.from(document.querySelectorAll('input[name="q6"]:checked'))
                          .map(el => el.value);

    const correct = ["csp"]; //La bonne réponse

    const result = document.getElementById("result-q6");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Mettre en place une politique de sécurité du contenu (Content Security Policy - CSP) est une mesure efficace pour prévenir les attaques de type cross-site scripting (XSS), car elle permet de contrôler les sources de contenu autorisées et de limiter l'exécution de scripts malveillants sur une page web.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q6', selected, result.textContent, true);
        document.getElementById("btn-valider-q6").style.display = "none";
        document.getElementById("btn-suivant-q6").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Il s'agit d'une mesure de sécurité qui permet de contrôler les sources de contenu autorisées sur une page web (Content Security Policy - CSP).";
        result.style.color = "red";
        recordQuestionReview('q6', selected, result.textContent, false);
        setTimeout(() => showNextQuestion('q6'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 7
function checkQ7() {
    const selected = Array.from(document.querySelectorAll('input[name="q7"]:checked'))
                          .map(el => el.value);

    const correct = ["nepasfaireconfiance"]; //La bonne réponse

    const result = document.getElementById("result-q7");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Il est important de ne pas faire confiance à des sources d'information non vérifiées, car elles peuvent diffuser des informations erronées ou biaisées, ce qui peut conduire à de mauvaises décisions ou à la propagation de fausses informations.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q7', selected, result.textContent, true);
        document.getElementById("btn-valider-q7").style.display = "none";
        document.getElementById("btn-suivant-q7").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Il ne faut pas faire confiance à des sources d'information non vérifiées.";
        result.style.color = "red";
        recordQuestionReview('q7', selected, result.textContent, false);
        setTimeout(() => showNextQuestion('q7'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 8
function checkQ8() {
    const selected = Array.from(document.querySelectorAll('input[name="q8"]:checked'))
                          .map(el => el.value);

    const correct = ["fournisseur"]; //La bonne réponse

    const result = document.getElementById("result-q8");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Faire confiance à un fournisseur de paiement réputé est un indicateur clé de la sécurité d'un site de commerce en ligne, car ces fournisseurs mettent en place des mesures de sécurité robustes pour protéger les informations de paiement des clients et réduire les risques de fraude.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q8', selected, result.textContent, true);
        document.getElementById("btn-valider-q8").style.display = "none";
        document.getElementById("btn-suivant-q8").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Il s'agit d'un indicateur clé de la sécurité d'un site de commerce en ligne : faire confiance à un fournisseur de paiement réputé.";
        result.style.color = "red";
        recordQuestionReview('q8', selected, result.textContent, false);
        setTimeout(() => showNextQuestion('q8'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 9
function checkQ9() {
    const selected = Array.from(document.querySelectorAll('input[name="q9"]:checked'))
                          .map(el => el.value);

    const correct = ["identite"]; //La bonne réponse

    const result = document.getElementById("result-q9");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Vérifier l'identité du destinataire avant d'envoyer des informations sensibles est crucial pour éviter les attaques de phishing et les fraudes, car cela permet de s'assurer que les données sont envoyées à la bonne personne ou organisation et non à un imposteur malveillant.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q9', selected, result.textContent, true);
        document.getElementById("btn-valider-q9").style.display = "none";
        document.getElementById("btn-suivant-q9").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Vérifier l'identité du destinataire avant d'envoyer des informations sensibles est crucial pour éviter les attaques de phishing et les fraudes.";
        result.style.color = "red";
        recordQuestionReview('q9', selected, result.textContent, false);
        setTimeout(() => showNextQuestion('q9'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 10
function checkQ10() {
    const selected = Array.from(document.querySelectorAll('input[name="q10"]:checked'))
                          .map(el => el.value);

    const correct = ["samekey"]; //La bonne réponse

    const result = document.getElementById("result-q10");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Utiliser la même clé de chiffrement pour plusieurs données sensibles peut compromettre la sécurité, car si un attaquant parvient à découvrir cette clé, il pourra potentiellement accéder à toutes les données protégées par cette clé, augmentant ainsi les risques de fuite d'informations et de compromission de la confidentialité.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q10', selected, result.textContent, true);
        document.getElementById("btn-valider-q10").style.display = "none";
        document.getElementById("btn-suivant-q10").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Utiliser la même clé de chiffrement pour plusieurs données sensibles peut compromettre la sécurité, car si un attaquant parvient à découvrir cette clé, il pourra potentiellement accéder à toutes les données protégées par cette clé.";
        result.style.color = "red";
        recordQuestionReview('q10', selected, result.textContent, false);
        setTimeout(() => showNextQuestion('q10'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 11
function checkQ11() {
    const selected = Array.from(document.querySelectorAll('input[name="q11"]:checked'))
                          .map(el => el.value);

    const correct = ["connaissance", "possession", "biometrie"]; //La bonne réponse

    const result = document.getElementById("result-q11");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Les trois facteurs d'authentification sont : la connaissance (quelque chose que vous savez, comme un mot de passe), la possession (quelque chose que vous avez, comme un téléphone ou une carte) et la biométrie (quelque chose que vous êtes, comme une empreinte digitale ou une reconnaissance faciale). Utiliser plusieurs facteurs d'authentification renforce la sécurité en rendant plus difficile pour les attaquants de compromettre un compte.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q11', selected, result.textContent, true);
        document.getElementById("btn-valider-q11").style.display = "none";
        document.getElementById("btn-suivant-q11").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Il s'agit de trois catégories de facteurs d'authentification qui renforcent la sécurité des comptes en ligne. La connaissance, la possession et la biométrie.";
        result.style.color = "red";
        recordQuestionReview('q11', selected, result.textContent, false);
        setTimeout(() => showNextQuestion('q11'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 12
function checkQ12() {
    const selected = Array.from(document.querySelectorAll('input[name="q12"]:checked'))
                          .map(el => el.value);

    const correct = ["vault", "rotation"]; //La bonne réponse

    const result = document.getElementById("result-q12");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Utiliser un gestionnaire de mots de passe (vault) et pratiquer la rotation régulière des mots de passe sont des pratiques essentielles pour maintenir la sécurité des comptes en ligne, car elles permettent de stocker les mots de passe de manière sécurisée et de réduire les risques associés à l'utilisation prolongée d'un même mot de passe, qui peut être compromis au fil du temps.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q12', selected, result.textContent, true);
        document.getElementById("btn-valider-q12").style.display = "none";
        document.getElementById("btn-suivant-q12").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Utiliser un gestionnaire de mots de passe (vault) et pratiquer la rotation régulière des mots de passe sont des pratiques essentielles pour maintenir la sécurité des comptes en ligne.";
        result.style.color = "red";
        recordQuestionReview('q12', selected, result.textContent, false);
        setTimeout(() => showNextQuestion('q12'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 13
function checkQ13() {
    const selected = Array.from(document.querySelectorAll('input[name="q13"]:checked'))
                          .map(el => el.value);

    const correct = ["privilege"]; //La bonne réponse

    const result = document.getElementById("result-q13");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Un rootkit est un type de logiciel malveillant conçu pour donner à un attaquant un accès privilégié et furtif à un système compromis, souvent en cachant sa présence et en permettant à l'attaquant de contrôler le système à distance sans être détecté.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q13', selected, result.textContent, true);
        document.getElementById("btn-valider-q13").style.display = "none";
        document.getElementById("btn-suivant-q13").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Un rootkit est un type de logiciel conçu pour donner à un attaquant un accès privilégié et furtif à un système compromis.";
        result.style.color = "red";
        recordQuestionReview('q13', selected, result.textContent, false);
        setTimeout(() => showNextQuestion('q13'), 2000);
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 14
function checkQ14() {
    const selected = Array.from(document.querySelectorAll('input[name="q14"]:checked'))
                          .map(el => el.value);

    const correct = ["pinning"]; //La bonne réponse

    const result = document.getElementById("result-q14");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Le pinning de certificat est une technique de sécurité qui consiste à associer un certificat spécifique à une application ou un site web, ce qui permet de prévenir les attaques de type man-in-the-middle en s'assurant que l'application ou le site web ne communique qu'avec des serveurs présentant le certificat attendu, même si un attaquant parvient à compromettre une autorité de certification ou à intercepter les communications.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q14', selected, result.textContent, true);
        document.getElementById("btn-valider-q14").style.display = "none";
        document.getElementById("btn-suivant-q14").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. Le pinning de certificat est une technique de sécurité qui consiste à associer un certificat spécifique à une application ou un site web pour prévenir les attaques de type man-in-the-middle.";
        result.style.color = "red";
        recordQuestionReview('q14', selected, result.textContent, false);
        setTimeout(() => showNextQuestion('q14'), 2000);
    }
    updateScore();
}

//Q15 / Q16 / Q17
//Bonnes réponses : clé = bloc gauche (A/B/C), valeur = bloc droit attendu (1/2/3)
const configs = {
  15: { correctMap: { A: "1", B: "3", C: "2" } },
  16: { correctMap: { A: "1", B: "2", C: "3" } },
  17: { correctMap: { A: "3", B: "2", C: "1" } },
};

//Appelée quand toutes les connexions d'une question sont correctes
//À compléter avec une explication personnalisée par question
function onBonneReponse15(result) {
  result.innerHTML = "Bonne réponse !<br><small></small>";
}

function onBonneReponse16(result) {
  result.innerHTML = "Bonne réponse !<br><small></small>";
}

function onBonneReponse17(result) {
  result.innerHTML = "Bonne réponse !<br><small></small>";
}

//Regroupe les callbacks par numéro de question pour les appeler dans la boucle
const onBonneReponse = {
  15: onBonneReponse15,
  16: onBonneReponse16,
  17: onBonneReponse17,
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
      result.textContent = "Mauvaise réponse.";
      result.style.color = "red";
      recordQuestionReview(`q${n}`, [], result.textContent, false);
      setTimeout(() => showNextQuestion(`q${n}`), 2000);
    }
    updateScore();
  });
});

//Fonction qui permet de vérifier la réponse de la question 18
function checkQ18() {
    const selected = Array.from(document.querySelectorAll('input[name="q18"]:checked'))
                          .map(el => el.value);

    const correct = ["chaine"]; //La bonne réponse

    const result = document.getElementById("result-q18");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! L'action qui est la plus pertinente pour vérifier la validité d'un certificat TLS est de vérifier la chaîne de certification, c'est-à-dire s'assurer que le certificat présenté par le serveur est émis par une autorité de certification de confiance et que la chaîne de certificats est complète et valide.";
        result.style.color = "green";
        score++;
        recordQuestionReview('q18', selected, result.textContent, true);
        document.getElementById("btn-valider-q18").style.display = "none";
        document.getElementById("btn-suivant-q18").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse. L'action qui est la plus pertinente pour vérifier la validité d'un certificat TLS est de vérifier la chaîne de certification, c'est-à-dire s'assurer que le certificat présenté par le serveur est émis par une autorité de certification de confiance et que la chaîne de certificats est complète et valide.";
        result.style.color = "red";
        recordQuestionReview('q18', selected, result.textContent, false);
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