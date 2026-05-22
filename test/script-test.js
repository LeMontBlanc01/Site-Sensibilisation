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