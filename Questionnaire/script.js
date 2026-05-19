console.log("JS chargé !");
document.getElementById("btn-valider-q2").style.display = "none";
function showQuestion(id) {
  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');
  document.getElementById(id).style.display = 'block';
  

  if (id !== 'q1') {
    const result1 = document.getElementById('result-q1');
    if (result1) {
      result1.textContent = '';
    }
  }

  if (id !== 'q2') {
    const result2 = document.getElementById('result-q2');
    if (result2) {
      result2.textContent = '';
    }
  }

  if (id !== 'q3') {
    const result3 = document.getElementById('result-q3');
    if (result3) {
      result3.textContent = '';
    }
  }
}

function checkQ1() {
    const selected = Array.from(document.querySelectorAll('input[name="q1"]:checked'))
                          .map(el => el.value);

    const correct = ["g7!pl9@vq2#rt"];

    const result = document.getElementById("result-q1");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q1").style.display = "none";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}


function arraysEqual(a, b) {
    return a.length === b.length && a.every(v => b.includes(v));
}

function checkQ2() {
    const selected = Array.from(document.querySelectorAll('input[name="q2"]:checked'))
                          .map(el => el.value);

    const correct = ["oui"];

    const result = document.getElementById("result-q2");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse ! ";
        result.style.color = "green";
        document.getElementById("btn-valider-q2").style.display = "none";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}
