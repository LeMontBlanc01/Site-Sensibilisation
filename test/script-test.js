console.log("JS chargé !");
let score = 0;

//Utilitaires

//Affiche la question demandée, cache les autres et réinitialise les résultats
function showQuestion(id) {
  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');
  document.getElementById(id).style.display = 'block';

  //Vide les messages de résultat quand on change de question
  ['q15', 'q16', 'q17'].forEach(qid => {
    if (id !== qid) {
      const r = document.getElementById(`result-${qid}`);
      if (r) r.textContent = '';
    }
  });

  //Les canvas ont une taille 0 quand leur question est cachée,
  //il faut donc les redimensionner au moment où elles deviennent visibles
  const match = id.match(/^q(16|17|18)$/);
  if (match) {
    const n = match[1];
    resizeCanvas(n);
    redraw(n);
  }
}

//Compare deux tableaux sans tenir compte de l'ordre
function arraysEqual(a, b) {
  return a.length === b.length && a.every(v => b.includes(v));
}

//Met à jour l'affichage du score
function updateScore() {
  const el = document.getElementById('score');
  if (el) el.textContent = `Score : ${score}`;
}
updateScore();


//Q15

function checkQ15() {
  const selected = Array.from(document.querySelectorAll('input[name="q15"]:checked'))
                        .map(el => el.value);
  const result = document.getElementById("result-q15");

  if (arraysEqual(selected, ["change"])) {
    result.innerHTML = "Bonne réponse !<br><small><!-- Explication Q15 ici --></small>";
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


//Q16 / Q17 / Q18

//Bonnes réponses : clé = bloc gauche (A/B/C), valeur = bloc droit attendu (1/2/3)
const configs = {
  16: { correctMap: { A: "3", B: "1", C: "2" } },
  17: { correctMap: { A: "2", B: "1", C: "3" } },
  18: { correctMap: { A: "2", B: "1", C: "3" } },
};

//État de chaque question : canvas, contexte, connexions tracées, bloc gauche sélectionné
const state = {};

//Appelée quand toutes les connexions d'une question sont correctes
//À compléter avec une explication personnalisée par question
function onBonneReponse16(result) {
  result.innerHTML = "Bonne réponse !<br><small>blablablabala</small>";
}

function onBonneReponse17(result) {
  result.innerHTML = "Bonne réponse !<br><small>blablablabal222a</small>";
}

function onBonneReponse18(result) {
  result.innerHTML = "Bonne réponse !<br><small>blablablabala33</small>";
}

//Regroupe les callbacks par numéro de question pour les appeler dans la boucle
const onBonneReponse = {
  16: onBonneReponse16,
  17: onBonneReponse17,
  18: onBonneReponse18,
};

[16, 17, 18].forEach(n => {
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