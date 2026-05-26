console.log("JS chargé !"); // Affiche un message dans la console pour confirmer que le fichier JS est bien chargé
let score = 0;
const joueurNom = prompt("Entrez votre prénom :") || "Anonyme";

// Ordre aléatoire des questions
let questionOrder = [];
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

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
        nextBtn.onclick = () => { history.back(); };
      }
    }
  });

  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');
  document.getElementById(questionOrder[0]).style.display = 'block';
}

window.addEventListener('load', initRandomQuestions);

function showQuestion(id) {
  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');  //On récupère toutes les divs de la classe "question" et on les cache
  document.getElementById(id).style.display = 'block';  //On affiche uniquement la question dont l'id est passé en paramètre
  
  //Si on change de question, on efface les résultats de Q1
  if (id !== 'q1') {
    const result1 = document.getElementById('result-q1');
    if (result1) {
      result1.textContent = '';
    }
  }

  //Pour Q2
  if (id !== 'q2') {
    const result2 = document.getElementById('result-q2');
    if (result2) {
      result2.textContent = '';
    }
  }

  //Pour Q3
  if (id !== 'q3') {
    const result3 = document.getElementById('result-q3');
    if (result3) {
      result3.textContent = '';
    }
  }

  //Pour Q4
  if (id !== 'q4') {
    const result4 = document.getElementById('result-q4');
    if (result4) {
      result4.textContent = '';
    }
  }

  //Pour Q5
  if (id !== 'q5') {
    const result5 = document.getElementById('result-q5');
    if (result5) {
      result5.textContent = '';
    }
  }

  //Pour Q6
  if (id !== 'q6') {
    const result6 = document.getElementById('result-q6');
    if (result6) {
      result6.textContent = '';
    }
  }

  //Pour Q7
  if (id !== 'q7') {
    const result7 = document.getElementById('result-q7');
    if (result7) {
      result7.textContent = '';
    }
  }

  //Pour Q8
  if (id !== 'q8') {
    const result8 = document.getElementById('result-q8');
    if (result8) {
      result8.textContent = '';
    }
  }

  //Pour Q9
  if (id !== 'q9') {
    const result9 = document.getElementById('result-q9');
    if (result9) {
      result9.textContent = '';
    }
  }

  //Pour Q10
  if (id !== 'q10') {
    const result10 = document.getElementById('result-q10');
    if (result10) {
      result10.textContent = '';
    }
  }

  //Pour Q11
  if (id !== 'q11') {
    const result11 = document.getElementById('result-q11');
    if (result11) {
      result11.textContent = '';
    }
  }

  //Pour Q12
  if (id !== 'q12') {
    const result12 = document.getElementById('result-q12');
    if (result12) {
      result12.textContent = '';
    }
  }

  //Pour Q13
  if (id !== 'q13') {
    const result13 = document.getElementById('result-q13');
    if (result13) {
      result13.textContent = '';
    }
  }

  //Pour Q14
  if (id !== 'q14') {
    const result14 = document.getElementById('result-q14');
    if (result14) {
      result14.textContent = '';
    }
  }

  //Pour Q15
  if (id !== 'q15') {
    const result15 = document.getElementById('result-q15');
    if (result15) {
      result15.textContent = '';
    }
  }

  if (id === 'q15') {
    const exportBtn = document.getElementById('btn-export');
    const result15 = document.getElementById('result-q15');
    if (exportBtn && result15 && result15.textContent.trim().length) {
      exportBtn.style.display = 'block';
    }
  }
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
    document.getElementById("btn-valider-q1").style.display = "none";
    document.getElementById("btn-suivant-q1").style.display = "inline-block";
  } else {
    result.textContent = "Mauvaise réponse.";
    result.style.color = "red";
    score--;
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
        `Score : ${score}/15`,
        '',
        'Détail des réponses :'
    ];
    for (let i = 1; i <= 15; i++) {
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
    const body = encodeURIComponent(`Bonjour,\n\nVeuillez trouver ci-joint le fichier de mes résultats.\n\nNom : ${joueurNom}\nNiveau : ${niveau}\nScore : ${score}/15\n\nMerci.`);
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
        document.getElementById("btn-valider-q2").style.display = "none";
        document.getElementById("btn-suivant-q2").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
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
        document.getElementById("btn-valider-q3").style.display = "none";
        document.getElementById("btn-suivant-q3").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
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
        document.getElementById("btn-valider-q4").style.display = "none";
        document.getElementById("btn-suivant-q4").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
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
        result.textContent = "Bonne réponse ! Maintenir les systèmes à jour avec les derniers correctifs de sécurité et restreindre les permissions des utilisateurs sont des mesures essentielles pour réduire la surface d'attaque et prévenir les accès non autorisés.";
        result.style.color = "green";
        document.getElementById("btn-valider-q5").style.display = "none";
        document.getElementById("btn-suivant-q5").style.display = "inline-block";
    } else {
        score--;
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
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
        document.getElementById("btn-valider-q6").style.display = "none";
        document.getElementById("btn-suivant-q6").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
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
        document.getElementById("btn-valider-q7").style.display = "none";
        document.getElementById("btn-suivant-q7").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
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
        document.getElementById("btn-valider-q8").style.display = "none";
        document.getElementById("btn-suivant-q8").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
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
        document.getElementById("btn-valider-q9").style.display = "none";
        document.getElementById("btn-suivant-q9").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
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
        document.getElementById("btn-valider-q10").style.display = "none";
        document.getElementById("btn-suivant-q10").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
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
        document.getElementById("btn-valider-q11").style.display = "none";
        document.getElementById("btn-suivant-q11").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
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
        document.getElementById("btn-valider-q12").style.display = "none";
        document.getElementById("btn-suivant-q12").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
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
        document.getElementById("btn-valider-q13").style.display = "none";
        document.getElementById("btn-suivant-q13").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
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
        document.getElementById("btn-valider-q14").style.display = "none";
        document.getElementById("btn-suivant-q14").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
    }
    updateScore();
}

//Fonction qui permet de vérifier la réponse de la question 15
function checkQ15() {
    const selected = Array.from(document.querySelectorAll('input[name="q15"]:checked'))
                          .map(el => el.value);

  const correct = ["compromission"]; //La bonne réponse: la compromission de la clé maître donnant accès à l'ensemble du coffre

    const result = document.getElementById("result-q15");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! La compromission de la clé maître donnant accès à l'ensemble du coffre est un risque majeur en matière de sécurité.";
        result.style.color = "green";
        score++;
        document.getElementById("btn-valider-q15").style.display = "none";
        document.getElementById("btn-suivant-q15").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
    }
    const exportBtn = document.getElementById("btn-export");
    if (exportBtn) {
        exportBtn.style.display = "block";
    }
    updateScore();
}

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

envoyerScore(joueurNom, score, "Moyen", 15);