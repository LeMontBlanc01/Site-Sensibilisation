console.log("JS chargé !");

function showQuestion(id) {
  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function checkQ1() {
    const selected = Array.from(document.querySelectorAll('input[name="q1"]:checked'))
                          .map(el => el.value);

    const correct = ["g7!pl9@vq2#rt"];

    const result = document.getElementById("result-q1");

    if (arraysEqual(selected, correct)) {
        result.textContent = "Bonne réponse !";
        result.style.color = "green";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
    }
}

function arraysEqual(a, b) {
    return a.length === b.length && a.every(v => b.includes(v));
}