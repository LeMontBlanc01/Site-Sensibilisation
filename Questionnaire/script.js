console.log("JS chargé !"); // Affiche un message dans la console pour confirmer que le fichier JS est bien chargé
let score = 0;
const joueurNom = prompt("Entrez votre prénom :") || "Anonyme";
const quizNiveau = "Facile";
const state = {};   //État de chaque question : canvas, contexte, connexions tracées, bloc gauche sélectionné

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
        nextBtn.onclick = goToResults;
        nextBtn.textContent = 'Voir les résultats';
      }
    }
  });

  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');
  document.getElementById(questionOrder[0]).style.display = 'block';
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

window.addEventListener('load', initRandomQuestions);

function goToResults() {
  localStorage.setItem('quizScore', String(score));
  localStorage.setItem('quizNiveau', quizNiveau);
  localStorage.setItem('quizNom', joueurNom);
  localStorage.setItem('quizTotal', '18');
  window.location.href = 'resultats.html';
}

function showQuestion(id) {
  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');  //On récupère toutes les divs de la classe "question" et on les cache
  document.getElementById(id).style.display = 'block';  //On affiche uniquement la question dont l'id est passé en paramètre
  
  //Vide les messages de résultat quand on change de question
  ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12','q13','q14','q15', 'q16', 'q17'].forEach(qid => {
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

  melangerReponses(id);
}

function showResult(id) {
  document.querySelectorAll('.result').forEach(r => r.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

//Fonction qui permet de vérifier la réponse de la question 1
function checkQ1() {
    const selected = Array.from(document.querySelectorAll('input[name="q1"]:checked'))  //Récupère toutes les cases cochées de la question 1 et on prend leur valeur
                          .map(el => el.value);

    const correct = ["g7!pl9@vq2#rt"]; //La bonne réponse

    const result = document.getElementById("result-q1");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Un bon mot de passe doit contenir au moins 12 caractères, avec une combinaison de lettres majuscules et minuscules, de chiffres et de caractères spéciaux.";
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
    const niveau = "Facile";
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

    const correct = ["oui"];  //La bonne réponse

    const result = document.getElementById("result-q2");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! La clé USB peut être infectée par un virus ou un malware, et en la connectant à votre ordinateur, vous risquez de contaminer votre système. Il est important de ne pas utiliser de périphériques de stockage inconnus ou non sécurisés.";
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

    const correct = ["separez", "utilisez1"]; //Les bonnes réponses

    const result = document.getElementById("result-q3");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Les bonnes pratiques pour protéger ses données personnelles en ligne incluent : séparer les comptes professionnels et personnels et limiter les informations personnelles partagées sur les réseaux sociaux.";
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

    const correct = ["vpn"]; //La bonne réponse

    const result = document.getElementById("result-q4");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Un VPN (Virtual Private Network soit Réseau privé virtuel) est un outil qui permet de sécuriser votre connexion internet en chiffrant vos données et en masquant votre adresse IP. Cela protège votre vie privée en ligne et vous permet d'accéder à des contenus restreints géographiquement.";
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

    const correct = ["verifiez", "antivirus"]; //La bonne réponse

    const result = document.getElementById("result-q5");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    if (arraysEqual(selected, correct)) {
        score ++;
        result.textContent = "Bonne réponse ! Pour vérifier l'authenticité d'un email, il est important de vérifier l'adresse de l'expéditeur, de ne pas cliquer sur les liens ou télécharger les pièces jointes, et d'utiliser un logiciel antivirus pour analyser les emails suspects.";
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

    const correct = ["failles"]; //La bonne réponse

    const result = document.getElementById("result-q6");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Il est important de maintenir son système d'exploitation et ses logiciels à jour pour bénéficier des dernières protections contre les failles de sécurité. Les mises à jour corrigent souvent des vulnérabilités qui pourraient être exploitées par des cybercriminels.";
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

    const correct = ["signaler"]; //La bonne réponse

    const result = document.getElementById("result-q7");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Il ne faut pas hésiter à signaler les contenus inappropriés ou les comportements suspects. Ne partagez jamais vos mots de passe ou vos informations personnelles avec des inconnus, même s'ils prétendent être de confiance.";
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

    const correct = ["gestionnaire"]; //La bonne réponse

    const result = document.getElementById("result-q8");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Utiliser un gestionnaire de mots de passe est une bonne pratique pour sécuriser ses mots de passe. Un gestionnaire de mots de passe stocke vos mots de passe de manière sécurisée et vous permet de générer des mots de passe forts et uniques pour chaque compte. Exemple: KeePass, LastPass, Dashlane.";
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

    const correct = ["infection"]; //La bonne réponse

    const result = document.getElementById("result-q9");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Il faut faire attention aux appareils qui vous sont inconnus, comme les clés USB trouvées ou prêtées par des personnes que vous ne connaissez pas. Ces appareils peuvent être infectés par des virus ou des logiciels malveillants qui peuvent compromettre la sécurité de votre ordinateur.";
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

    const correct = ["adresse"]; //La bonne réponse

    const result = document.getElementById("result-q10");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Il faut toujours vérifier l'adresse URL d'un site avant de saisir des informations personnelles ou de se connecter. Assurez-vous que l'URL commence par 'https://' et que le nom de domaine est correct pour éviter les sites de phishing.";
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

    const correct = ["2fa"]; //La bonne réponse

    const result = document.getElementById("result-q11");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! L'authentification à deux facteurs (2FA) est une méthode de sécurité qui nécessite deux formes d'identification pour accéder à un compte. En plus de votre mot de passe, vous devez fournir un code généré par une application d'authentification ou reçu par SMS, ce qui rend plus difficile pour les attaquants d'accéder à votre compte.";
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

    const correct = ["regulier"]; //La bonne réponse

    const result = document.getElementById("result-q12");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Sauvegarder régulièrement ses données est une bonne pratique pour éviter de les perdre en cas d'incident (panne, attaque, etc.). Utilisez des solutions de sauvegarde en ligne ou des disques durs externes pour protéger vos données importantes.";
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

    const correct = ["source"]; //La bonne réponse

    const result = document.getElementById("result-q13");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Vérifiez toujours la source d'une application avant de la télécharger. Téléchargez des applications uniquement à partir de sources fiables, comme les boutiques d'applications officielles (Google Play Store, Apple App Store) ou les sites web des éditeurs de logiciels réputés.";
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

    const correct = ["malware"]; //La bonne réponse

    const result = document.getElementById("result-q14");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Un malware (contraction de 'malicious software') est un logiciel malveillant conçu pour infiltrer, endommager ou perturber un système informatique. Les malwares peuvent prendre différentes formes, comme les virus, les ransomwares, etc. Ils peuvent voler des données, espionner les utilisateurs ou rendre un système inutilisable.";
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


//Q15 / Q16 / Q17

//Bonnes réponses : clé = bloc gauche (A/B/C), valeur = bloc droit attendu (1/2/3)
const configs = {
  15: { correctMap: { A: "3", B: "1", C: "2" } },
  16: { correctMap: { A: "2", B: "1", C: "3" } },
  17: { correctMap: { A: "2", B: "1", C: "3" } },
};


//Appelée quand toutes les connexions d'une question sont correctes
//À compléter avec une explication personnalisée par question
function onBonneReponse15(result) {
  result.innerHTML = "Bonne réponse !<br><small>Si l'adresse de messagerie a été usurpée, il faut immédiatement changer le mot de passe pour éviter que l'attaquant ne conserve l'accès au compte et ne continue à envoyer des messages frauduleux en votre nom. Si, par erreur, vous communiquez votre numéro de carte bancaire vous devez faire opposition auprès de votre banque et déposer plainte. Si vous identifiez une adresse de site d'hameçonnage (site qui peut voler des identifiants, infecter le système ou accéder au réseau) vous devez le signaler à Phishing Initiative (Plateforme de signalement et de prévention contre l'hameçonnage).</small>";
}

function onBonneReponse16(result) {
  result.innerHTML = "Bonne réponse !<br><small>Si vous travaillez régulièrement à l'extérieur, évitez de vous connecter à un réseau Wi-Fi public, car ces réseaux sont souvent non sécurisés et peuvent permettre à des personnes malveillantes d'intercepter vos données. Si vous perdez ou vous vous faites voler votre téléphone, vous devez bloquer votre ligne en appelant votre opérateur et bloquer votre téléphone en communiquant votre code IMEI (identifiant unique de la puce réseau de votre appareil), puis déposer plainte. Si vous téléchargez un jeu sur votre téléphone, n'autorisez pas l'accès à vos photos, vos contacts et vos messages, car un jeu n'a aucune raison légitime d'accéder à ces données personnelles.</small>";
}

function onBonneReponse17(result) {
  result.innerHTML = "Bonne réponse !<br><small>Si vous êtes à la maison et vous devez consulter vos messages professionnels, assurez-vous de le faire uniquement à partir de votre ordinateur professionnel. Si vous vous apprêtez à stocker des documents professionnels sur un service en ligne personnel, demandez l'autorisation à votre employeur et prenez des mesures de sécurité supplémentaires. Si ça vous arrive de réaliser des téléchargements illégaux depuis votre ordinateur professionnel, votre entreprise pourrait contrôler votre utilisation de la connexion Internet professionnelle et se retourner contre vous.</small>";
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
      document.getElementById(`btn-valider-q${n}`).style.display = "none";
      document.getElementById(`btn-suivant-q${n}`).style.display = "inline-block";
    } else {
      result.textContent = "Mauvaise réponse.";
      result.style.color = "red";
      score--;
    }
    updateScore();
  });
});



//Fonction qui permet de vérifier la réponse de la question 18
function checkQ18() {
    const selected = Array.from(document.querySelectorAll('input[name="q18"]:checked'))
                          .map(el => el.value);

    const correct = ["change"]; //La bonne réponse

    const result = document.getElementById("result-q18");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! En cas de suspicion de phishing, il est important de changer immédiatement vos mots de passe pour les comptes concernés. De plus, signalez l'incident à votre service informatique ou à l'équipe de sécurité de votre organisation pour qu'ils puissent prendre les mesures nécessaires pour protéger les autres utilisateurs.";
        result.style.color = "green";
        score++;
        document.getElementById("btn-valider-q18").style.display = "none";
        document.getElementById("btn-suivant-q18").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
    }
    document.getElementById("btn-suivant-q18").style.display = "inline-block";
    updateScore();
    envoyerScore(joueurNom, score, "Facile", 18);
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
