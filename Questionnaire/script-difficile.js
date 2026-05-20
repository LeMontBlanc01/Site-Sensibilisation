console.log("JS difficile chargé !");
let score = 0;

function showQuestion(id) {
    document.querySelectorAll('.question').forEach(q => q.style.display = 'none');
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';

    for (let i = 1; i <= 15; i++) {
        const r = document.getElementById(`result-q${i}`);
        if (r) r.textContent = '';
    }
}

function arraysEqual(a, b) {
    return a.length === b.length && a.every(v => b.includes(v));
}

function updateScore() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `Score : ${score}`;
    }
}

function checkGeneric(n, correct) {
    const selected = Array.from(document.querySelectorAll(`input[name="q${n}"]:checked`)).map(el => el.value);
    const result = document.getElementById(`result-q${n}`);
    if (arraysEqual(selected, correct)) {
        score++;
        if (result) {
            result.textContent = "Bonne réponse !";
            result.style.color = "green";
        }
        const btnVal = document.getElementById(`btn-valider-q${n}`);
        const btnNext = document.getElementById(`btn-suivant-q${n}`);
        if (btnVal) btnVal.style.display = 'none';
        if (btnNext) btnNext.style.display = 'inline-block';
    } else {
        if (result) {
            result.textContent = "Mauvaise réponse.";
            result.style.color = "red";
        }
        score--;
    }
    updateScore();
}

function checkQ1() { checkGeneric(1, ["sslv3"]); }
function checkQ2() { checkGeneric(2, ["sortie"]); }
function checkQ3() { checkGeneric(3, ["param", "validation"]); }
function checkQ4() { checkGeneric(4, ["oneway"]); }
function checkQ5() { checkGeneric(5, ["unique"]); }
function checkQ6() { checkGeneric(6, ["csp"]); }
function checkQ7() { checkGeneric(7, ["nepasfaireconfiance"]); }
function checkQ8() { checkGeneric(8, ["fournisseur"]); }
function checkQ9() { checkGeneric(9, ["identite"]); }
function checkQ10() { checkGeneric(10, ["samekey"]); }
function checkQ11() { checkGeneric(11, ["connaissance", "possession", "biometrie"]); }
function checkQ12() { checkGeneric(12, ["vault", "rotation"]); }
function checkQ13() { checkGeneric(13, ["privilege"]); }
function checkQ14() { checkGeneric(14, ["pinning"]); }
function checkQ15() { checkGeneric(15, ["chaine"]); }

updateScore();
