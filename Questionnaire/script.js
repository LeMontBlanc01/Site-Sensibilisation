console.log("JS chargé !"); // Affiche un message dans la console pour confirmer que le fichier JS est bien chargé

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

    const correct = ["g7!pl9@vq2#rt"]; //La bonne réponse

    const result = document.getElementById("result-q1");  //Zone où afficher le résultat

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! Un bon mot de passe doit contenir au moins 12 caractères, avec une combinaison de lettres majuscules et minuscules, de chiffres et de caractères spéciaux.";
        result.style.color = "green";
        document.getElementById("btn-valider-q1").style.display = "none";
        document.getElementById("btn-suivant-q1").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

//Fonction utilitaire qui compare deux tableaux
function arraysEqual(a, b) {
    return a.length === b.length && a.every(v => b.includes(v));  //Même longueur + chaque élément de a est dans b
}

//Fonction qui permet de vérifier la réponse de la question 2
function checkQ2() {
    const selected = Array.from(document.querySelectorAll('input[name="q2"]:checked'))
                          .map(el => el.value);

    const correct = ["oui"];  //La bonne réponse

    const result = document.getElementById("result-q2");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! La clé USB peut être infectée par un virus ou un malware, et en la connectant à votre ordinateur, vous risquez de contaminer votre système. Il est important de ne pas utiliser de périphériques de stockage inconnus ou non sécurisés.";
        result.style.color = "green";
        document.getElementById("btn-valider-q2").style.display = "none";
        document.getElementById("btn-suivant-q2").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

//Fonction qui permet de vérifier la réponse de la question 3
function checkQ3() {
    const selected = Array.from(document.querySelectorAll('input[name="q3"]:checked'))
                          .map(el => el.value);

    const correct = ["separez", "utilisez1"]; //Les bonnes réponses

    const result = document.getElementById("result-q3");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q3").style.display = "none";
        document.getElementById("btn-suivant-q3").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

//Fonction qui permet de vérifier la réponse de la question 4
function checkQ4() {
    const selected = Array.from(document.querySelectorAll('input[name="q4"]:checked'))
                          .map(el => el.value);

    const correct = ["vpn"]; //La bonne réponse

    const result = document.getElementById("result-q4");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q4").style.display = "none";
        document.getElementById("btn-suivant-q4").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

//Fonction qui permet de vérifier la réponse de la question 5
function checkQ5() {
    const selected = Array.from(document.querySelectorAll('input[name="q5"]:checked'))
                          .map(el => el.value);

    const correct = ["verifiez", "antivirus"]; //La bonne réponse

    const result = document.getElementById("result-q5");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q5").style.display = "none";
        document.getElementById("btn-suivant-q5").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

//Fonction qui permet de vérifier la réponse de la question 6
function checkQ6() {
    const selected = Array.from(document.querySelectorAll('input[name="q6"]:checked'))
                          .map(el => el.value);

    const correct = ["failles"]; //La bonne réponse

    const result = document.getElementById("result-q6");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q6").style.display = "none";
        document.getElementById("btn-suivant-q6").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

//Fonction qui permet de vérifier la réponse de la question 7
function checkQ7() {
    const selected = Array.from(document.querySelectorAll('input[name="q7"]:checked'))
                          .map(el => el.value);

    const correct = ["signaler"]; //La bonne réponse

    const result = document.getElementById("result-q7");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q7").style.display = "none";
        document.getElementById("btn-suivant-q7").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

//Fonction qui permet de vérifier la réponse de la question 8
function checkQ8() {
    const selected = Array.from(document.querySelectorAll('input[name="q8"]:checked'))
                          .map(el => el.value);

    const correct = ["gestionnaire"]; //La bonne réponse

    const result = document.getElementById("result-q8");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q8").style.display = "none";
        document.getElementById("btn-suivant-q8").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

//Fonction qui permet de vérifier la réponse de la question 9
function checkQ9() {
    const selected = Array.from(document.querySelectorAll('input[name="q9"]:checked'))
                          .map(el => el.value);

    const correct = ["infection"]; //La bonne réponse

    const result = document.getElementById("result-q9");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q9").style.display = "none";
        document.getElementById("btn-suivant-q9").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

//Fonction qui permet de vérifier la réponse de la question 10
function checkQ10() {
    const selected = Array.from(document.querySelectorAll('input[name="q10"]:checked'))
                          .map(el => el.value);

    const correct = ["adresse"]; //La bonne réponse

    const result = document.getElementById("result-q10");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q10").style.display = "none";
        document.getElementById("btn-suivant-q10").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

//Fonction qui permet de vérifier la réponse de la question 11
function checkQ11() {
    const selected = Array.from(document.querySelectorAll('input[name="q11"]:checked'))
                          .map(el => el.value);

    const correct = ["2fa"]; //La bonne réponse

    const result = document.getElementById("result-q11");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q11").style.display = "none";
        document.getElementById("btn-suivant-q11").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

//Fonction qui permet de vérifier la réponse de la question 12
function checkQ12() {
    const selected = Array.from(document.querySelectorAll('input[name="q12"]:checked'))
                          .map(el => el.value);

    const correct = ["regulier"]; //La bonne réponse

    const result = document.getElementById("result-q12");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q12").style.display = "none";
        document.getElementById("btn-suivant-q12").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

//Fonction qui permet de vérifier la réponse de la question 13
function checkQ13() {
    const selected = Array.from(document.querySelectorAll('input[name="q13"]:checked'))
                          .map(el => el.value);

    const correct = ["source"]; //La bonne réponse

    const result = document.getElementById("result-q13");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q13").style.display = "none";
        document.getElementById("btn-suivant-q13").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

//Fonction qui permet de vérifier la réponse de la question 14
function checkQ14() {
    const selected = Array.from(document.querySelectorAll('input[name="q14"]:checked'))
                          .map(el => el.value);

    const correct = ["malware"]; //La bonne réponse

    const result = document.getElementById("result-q14");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q14").style.display = "none";
        document.getElementById("btn-suivant-q14").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

//Fonction qui permet de vérifier la réponse de la question 15
function checkQ15() {
    const selected = Array.from(document.querySelectorAll('input[name="q15"]:checked'))
                          .map(el => el.value);

    const correct = ["change"]; //La bonne réponse

    const result = document.getElementById("result-q15");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q15").style.display = "none";
        document.getElementById("btn-suivant-q15").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}