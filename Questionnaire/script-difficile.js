console.log("JS chargé !"); // Affiche un message dans la console pour confirmer que le fichier JS est bien chargé
let score = 0;

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

//Fonction qui permet de vérifier la réponse de la question 2
function checkQ2() {
    const selected = Array.from(document.querySelectorAll('input[name="q2"]:checked'))
                          .map(el => el.value);

    const correct = ["sortie"];  //La bonne réponse

    const result = document.getElementById("result-q2");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! En cas de ransomware, la meilleure solution est de couper la machine du réseau pour éviter que le malware ne se propage à d'autres systèmes et de contacter immédiatement les équipes de sécurité pour une analyse approfondie.";
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

    const correct = ["param", "validation"]; //Les bonnes réponses

    const result = document.getElementById("result-q3");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! La validation côté serveur est essentielle pour garantir la sécurité des applications web, car elle permet de vérifier et de filtrer les données entrantes, empêchant ainsi les attaques telles que l'injection SQL, les scripts intersites (XSS) et d'autres formes de manipulation de données malveillantes.";
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

    const correct = ["oneway"]; //La bonne réponse

    const result = document.getElementById("result-q4");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Un message avec une grammaire parfaite et inattendue est souvent un signe de phishing, car les attaquants utilisent parfois des outils de traduction ou de génération de texte pour créer des messages qui semblent légitimes mais qui contiennent des erreurs subtiles ou un style d'écriture inhabituel.";
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

    const correct = ["unique"]; //La bonne réponse

    const result = document.getElementById("result-q5");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    if (arraysEqual(selected, correct)) {
        score ++;
        result.textContent = "Bonne réponse ! Utiliser un mot de passe unique pour chaque compte est crucial pour la sécurité en ligne, car cela empêche qu'une compromission d'un compte n'entraîne la compromission d'autres comptes, réduisant ainsi les risques de piratage et de vol d'identité.";
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

    const correct = ["csp"]; //La bonne réponse

    const result = document.getElementById("result-q6");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Mettre en place une politique de sécurité du contenu (Content Security Policy - CSP) est une mesure efficace pour prévenir les attaques de type cross-site scripting (XSS), car elle permet de contrôler les sources de contenu autorisées et de limiter l'exécution de scripts malveillants sur une page web.";
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

    const correct = ["nepasfaireconfiance"]; //La bonne réponse

    const result = document.getElementById("result-q7");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Il est important de ne pas faire confiance à des sources d'information non vérifiées, car elles peuvent diffuser des informations erronées ou biaisées, ce qui peut conduire à de mauvaises décisions ou à la propagation de fausses informations.";
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

    const correct = ["fournisseur"]; //La bonne réponse

    const result = document.getElementById("result-q8");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Faire confiance à un fournisseur de paiement réputé est un indicateur clé de la sécurité d'un site de commerce en ligne, car ces fournisseurs mettent en place des mesures de sécurité robustes pour protéger les informations de paiement des clients et réduire les risques de fraude.";
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

    const correct = ["identite"]; //La bonne réponse

    const result = document.getElementById("result-q9");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Vérifier l'identité du destinataire avant d'envoyer des informations sensibles est crucial pour éviter les attaques de phishing et les fraudes, car cela permet de s'assurer que les données sont envoyées à la bonne personne ou organisation et non à un imposteur malveillant.";
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

    const correct = ["samekey"]; //La bonne réponse

    const result = document.getElementById("result-q10");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Utiliser la même clé de chiffrement pour plusieurs données sensibles peut compromettre la sécurité, car si un attaquant parvient à découvrir cette clé, il pourra potentiellement accéder à toutes les données protégées par cette clé, augmentant ainsi les risques de fuite d'informations et de compromission de la confidentialité.";
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

    const correct = ["connaissance", "possession", "biometrie"]; //La bonne réponse

    const result = document.getElementById("result-q11");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Les trois facteurs d'authentification sont : la connaissance (quelque chose que vous savez, comme un mot de passe), la possession (quelque chose que vous avez, comme un téléphone ou une carte) et la biométrie (quelque chose que vous êtes, comme une empreinte digitale ou une reconnaissance faciale). Utiliser plusieurs facteurs d'authentification renforce la sécurité en rendant plus difficile pour les attaquants de compromettre un compte.";
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

    const correct = ["vault", "rotation"]; //La bonne réponse

    const result = document.getElementById("result-q12");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Utiliser un gestionnaire de mots de passe (vault) et pratiquer la rotation régulière des mots de passe sont des pratiques essentielles pour maintenir la sécurité des comptes en ligne, car elles permettent de stocker les mots de passe de manière sécurisée et de réduire les risques associés à l'utilisation prolongée d'un même mot de passe, qui peut être compromis au fil du temps.";
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

    const correct = ["privilege"]; //La bonne réponse

    const result = document.getElementById("result-q13");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Le principe du moindre privilège consiste à accorder aux utilisateurs et aux processus uniquement les permissions nécessaires pour accomplir leurs tâches, ce qui réduit les risques de compromission et de propagation d'attaques en limitant les actions qu'un attaquant peut effectuer en cas de compromission d'un compte ou d'un processus.";
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

    const correct = ["pinning"]; //La bonne réponse

    const result = document.getElementById("result-q14");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Le pinning de certificat est une technique de sécurité qui consiste à associer un certificat spécifique à une application ou un site web, ce qui permet de prévenir les attaques de type man-in-the-middle en s'assurant que l'application ou le site web ne communique qu'avec des serveurs présentant le certificat attendu, même si un attaquant parvient à compromettre une autorité de certification ou à intercepter les communications.";
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

    const correct = ["chaine"]; //La bonne réponse

    const result = document.getElementById("result-q15");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! L'utilisation d'une chaîne de confiance (chain of trust) est essentielle pour garantir la sécurité des communications en ligne, car elle permet de vérifier l'authenticité des certificats et des entités impliquées dans une communication, assurant ainsi que les données sont échangées avec des parties légitimes et de confiance.";
        result.style.color = "green";
        score++;
        document.getElementById("btn-valider-q15").style.display = "none";
        document.getElementById("btn-suivant-q15").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
    }
    updateScore();
}

async function envoyerScore(nom, score, niveau, total) {
  try {
    await fetch('http://localhost:3001/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, score, niveau, total })
    });
    console.log('Score envoyé avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'envoi du score :', error);
  }
}

const nom = prompt("Entrez votre nom :");
envoyerScore(nom, score, "facile", 15);


