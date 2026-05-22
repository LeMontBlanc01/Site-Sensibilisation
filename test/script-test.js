console.log("JS chargé !"); // Affiche un message dans la console pour confirmer que le fichier JS est bien chargé
let score = 0;


function showQuestion(id) {
  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');  //On récupère toutes les divs de la classe "question" et on les cache
  document.getElementById(id).style.display = 'block';  //On affiche uniquement la question dont l'id est passé en paramètre
  
  // Quand on affiche Q16, on redimensionne le canvas
  // → indispensable car Q16 est cachée au chargement, donc le canvas aurait une hauteur 0
  if (id === 'q16') {
      resizeCanvas(); // Donne au canvas la bonne taille réelle
      redraw();       // Redessine les lignes déjà créées
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





// Récupération du canvas et de son contexte 2D
const canvas = document.getElementById("lignes");
const ctx = canvas.getContext("2d");

// Ajuste la taille du canvas pour qu'il corresponde exactement au conteneur
// → essentiel pour que les lignes soient dessinées dans la bonne zone
function resizeCanvas() {
  canvas.width = document.getElementById("conteneur").clientWidth;
  canvas.height = document.getElementById("conteneur").clientHeight;
}
resizeCanvas(); // Premier appel (sera corrigé ensuite par showQuestion('q16'))



// Recalcule et redessine les lignes quand la fenêtre change de taille
// → évite que les lignes se décalent si l'utilisateur redimensionne la fenêtre
window.addEventListener("resize", () => {
  resizeCanvas();
  redraw();
});

let blocGaucheSelectionne = null;   // Stocke le bloc de gauche sélectionné
let connexions = [];                // Liste des connexions créées (gauche → droite)

// Sélection des blocs
const blocsGauche = document.querySelectorAll(".gauche .bloc");
const blocsDroite = document.querySelectorAll(".droite .bloc");

// Fonction pour obtenir le centre d’un bloc
// → permet de tracer une ligne proprement entre deux blocs
function getCenter(el) {
  const r = el.getBoundingClientRect();
  const cont = document.getElementById("conteneur").getBoundingClientRect();

  return {
    x: r.left - cont.left + r.width / 2,
    y: r.top - cont.top + r.height / 2
  };
}

// Efface et redessine toutes les lignes existantes
// → appelé après chaque connexion ou redimensionnement
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 3;

  connexions.forEach(c => {
    const blocG = document.querySelector(`.gauche .bloc[data-id="${c.left}"]`);
    const blocD = document.querySelector(`.droite .bloc[data-id="${c.right}"]`);

    const p1 = getCenter(blocG);
    const p2 = getCenter(blocD);

    // Rouge si incorrect, bleu sinon
    ctx.strokeStyle = c.correct === false ? "#e74c3c" : "#3498db";

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  });
}

// Gestion du clic sur les blocs de gauche
blocsGauche.forEach(bloc => {
  bloc.addEventListener("click", () => {

    // Retire la sélection précédente
    blocsGauche.forEach(b => b.classList.remove("selected"));

    // Sélectionne le bloc cliqué
    bloc.classList.add("selected");

    // Stocke l'identifiant du bloc sélectionné
    blocGaucheSelectionne = bloc.dataset.id;
  });
});

// Gestion du clic sur les blocs de droite
blocsDroite.forEach(bloc => {
  bloc.addEventListener("click", () => {

    // On ne peut connecter que si un bloc gauche est sélectionné
    if (!blocGaucheSelectionne) return;

    // Supprime une éventuelle connexion précédente pour ce bloc gauche
    // → garantit qu’un bloc gauche ne peut avoir qu’une seule liaison
    connexions = connexions.filter(c => c.left !== blocGaucheSelectionne);

    // Ajoute la nouvelle connexion
    connexions.push({
      left: blocGaucheSelectionne,
      right: bloc.dataset.id,
      correct: null // sera défini lors de la validation
    });

    // Désélectionne le bloc gauche
    blocsGauche.forEach(b => b.classList.remove("selected"));
    blocGaucheSelectionne = null;

    redraw(); // Met à jour les lignes affichées
  });
});

// Vérification des réponses
document.getElementById("btn-valider-q16").addEventListener("click", () => {

    const correctMap = { A: "3", B: "1", C: "2" }; // Solutions officielles
    let bonnesConnexions = 0;

    // Vérifie chaque connexion
    connexions.forEach(c => {
        c.correct = c.right === correctMap[c.left]; // Compare la réponse donnée avec la bonne
        if (c.correct) bonnesConnexions++;
    });

    redraw(); // Met à jour les couleurs des lignes (rouge/bleu)

    const result = document.getElementById("result-q16");

    // Si toutes les connexions sont correctes
    if (bonnesConnexions === 3) {
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
});