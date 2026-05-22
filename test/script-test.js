console.log("JS chargé !"); // Affiche un message dans la console pour confirmer que le fichier JS est bien chargé
let score = 0;

function showQuestion(id) {
  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');  //On récupère toutes les divs de la classe "question" et on les cache
  document.getElementById(id).style.display = 'block';  //On affiche uniquement la question dont l'id est passé en paramètre
  
  //Si on change de question, on efface les résultats de Q

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

  //Pour Q16
  if (id !== 'q16') {
    const result16 = document.getElementById('result-q16');
    if (result16) {
      result16.textContent = '';
    }
  }

}

function showResult(id) {
  document.querySelectorAll('.result').forEach(r => r.style.display = 'none');
  document.getElementById(id).style.display = 'block';
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


//Fonction qui permet de vérifier la réponse de la question 15
function checkQ15() {
    const selected = Array.from(document.querySelectorAll('input[name="q15"]:checked'))
                          .map(el => el.value);

    const correct = ["change"]; //La bonne réponse

    const result = document.getElementById("result-q15");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse !";
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

//Fonction qui permet de vérifier la réponse de la question 16
function checkQ16() {
    const selected = Array.from(document.querySelectorAll('input[name="q16"]:checked'))
                          .map(el => el.value);

    const correct = ["change"]; //La bonne réponse

    const result = document.getElementById("result-q16");  //Récupère l'élément HTML où sera affiché le message de résultat pour la question

    //Bonne réponse ou mauvaise réponse selon les cases cochées
    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse !";
        result.style.color = "green";
        score++;
        document.getElementById("btn-valider-q16").style.display = "none";
        document.getElementById("btn-suivant-q16").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
    }
    updateScore();
}