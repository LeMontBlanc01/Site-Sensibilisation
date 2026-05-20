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


  if (id !== 'q4') {
    const result4 = document.getElementById('result-q4');
    if (result4) {
      result4.textContent = '';
    }
  }

  if (id !== 'q5') {
    const result5 = document.getElementById('result-q5');
    if (result5) {
      result5.textContent = '';
    }
  }

}
//Fonction qui permet de vérifier la réponse de la question 1
function checkQ1() {
    const selected = Array.from(document.querySelectorAll('input[name="q1"]:checked'))  //Récupère toutes les cases cochées de la question 1 et on prend leur valeur
                          .map(el => el.value);

    const correct = ["g7!pl9@vq2#rt"]; //La bonne réponse

    const result = document.getElementById("result-q1");  //Zone où afficher le résultat

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
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

    const correct = ["oui"];

    const result = document.getElementById("result-q2");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q2").style.display = "none";
        document.getElementById("btn-suivant-q2").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

function checkQ3() {
    const selected = Array.from(document.querySelectorAll('input[name="q3"]:checked'))
                          .map(el => el.value);

    const correct = ["separez", "utilisez1"]; //Il faut cocher les cases "Séparez travail et personnel" et "Utilisez plusieurs adresses électroniques"

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

