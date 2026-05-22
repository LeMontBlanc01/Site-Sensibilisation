console.log("JS chargé !"); // Affiche un message dans la console pour confirmer que le fichier JS est bien chargé
let score = 0;


function showQuestion(id) {
  document.querySelectorAll('.question').forEach(q => q.style.display = 'none');  //On récupère toutes les divs de la classe "question" et on les cache
  document.getElementById(id).style.display = 'block';  //On affiche uniquement la question dont l'id est passé en paramètre
  
  // Quand on affiche Q16, on redimensionne le canvas
  // → indispensable car Q16 est cachée au chargement, donc le canvas aurait une hauteur 0
  if (id === 'q16') {
      resizeCanvas16(); // Donne au canvas la bonne taille réelle
      redraw16();       // Redessine les lignes déjà créées
  }

  // Quand on affiche Q17, on redimensionne le canvas
  // → indispensable car Q17 est cachée au chargement, donc le canvas aurait une hauteur 0
  if (id === 'q17') {
      resizeCanvas17(); // Donne au canvas la bonne taille réelle
      redraw17();       // Redessine les lignes déjà créées
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

  //Pour Q17
  if (id !== 'q17') {
    const result17 = document.getElementById('result-q17');
    if (result17) {
      result17.textContent = '';
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
const canvas16 = document.getElementById("lignes16");
const ctx16 = canvas16.getContext("2d");

// Ajuste la taille du canvas pour qu'il corresponde exactement au conteneur
// → essentiel pour que les lignes soient dessinées dans la bonne zone
function resizeCanvas16() {
  canvas16.width = document.getElementById("conteneur16").clientWidth;
  canvas16.height = document.getElementById("conteneur16").clientHeight;
}
resizeCanvas16(); // Premier appel (sera corrigé ensuite par showQuestion('q16'))



// Recalcule et redessine les lignes quand la fenêtre change de taille
// → évite que les lignes se décalent si l'utilisateur redimensionne la fenêtre
window.addEventListener("resize", () => {
  resizeCanvas16();
  redraw16();
});

let blocGaucheSelectionne16 = null;   // Stocke le bloc de gauche sélectionné
let connexions16 = [];                // Liste des connexions créées (gauche → droite)

// Sélection des blocs
const blocsGauche16 = document.querySelectorAll(".gauche16 .bloc16");
const blocsDroite16 = document.querySelectorAll(".droite16 .bloc16");

// Fonction pour obtenir le centre d’un bloc
// → permet de tracer une ligne proprement entre deux blocs
function getCenter16(el) {
  const r = el.getBoundingClientRect();
  const cont = document.getElementById("conteneur16").getBoundingClientRect();

  return {
    x: r.left - cont.left + r.width / 2,
    y: r.top - cont.top + r.height / 2
  };
}

// Efface et redessine toutes les lignes existantes
// → appelé après chaque connexion ou redimensionnement
function redraw16() {
  ctx16.clearRect(0, 0, canvas16.width, canvas16.height);
  ctx16.lineWidth = 3;

  connexions16.forEach(c => {
    const blocG = document.querySelector(`.gauche16 .bloc16[data-id="${c.left}"]`);
    const blocD = document.querySelector(`.droite16 .bloc16[data-id="${c.right}"]`);

    const p1 = getCenter16(blocG);
    const p2 = getCenter16(blocD);

    // Rouge si incorrect, bleu sinon
    ctx16.strokeStyle = c.correct === false ? "#e74c3c" : "#3498db";

    ctx16.beginPath();
    ctx16.moveTo(p1.x, p1.y);
    ctx16.lineTo(p2.x, p2.y);
    ctx16.stroke();
  });
}

// Gestion du clic sur les blocs de gauche
blocsGauche16.forEach(bloc => {
  bloc.addEventListener("click", () => {

    // Retire la sélection précédente
    blocsGauche16.forEach(b => b.classList.remove("selected"));

    // Sélectionne le bloc cliqué
    bloc.classList.add("selected");

    // Stocke l'identifiant du bloc sélectionné
    blocGaucheSelectionne16 = bloc.dataset.id;
  });
});

// Gestion du clic sur les blocs de droite
blocsDroite16.forEach(bloc => {
  bloc.addEventListener("click", () => {

    // On ne peut connecter que si un bloc gauche est sélectionné
    if (!blocGaucheSelectionne16) return;

    // Supprime une éventuelle connexion précédente pour ce bloc gauche
    // → garantit qu’un bloc gauche ne peut avoir qu’une seule liaison
    connexions16 = connexions16.filter(c => c.left !== blocGaucheSelectionne16);

    // Ajoute la nouvelle connexion
    connexions16.push({
      left: blocGaucheSelectionne16,
      right: bloc.dataset.id,
      correct: null // sera défini lors de la validation
    });

    // Désélectionne le bloc gauche
    blocsGauche16.forEach(b => b.classList.remove("selected"));
    blocGaucheSelectionne16 = null;

    redraw16(); // Met à jour les lignes affichées
  });
});

// Vérification des réponses
document.getElementById("btn-valider-q16").addEventListener("click", () => {

    const correctMap16 = { A: "3", B: "1", C: "2" }; // Solutions officielles
    let bonnesConnexions = 0;

    // Vérifie chaque connexion
    connexions16.forEach(c => {
        c.correct = c.right === correctMap16[c.left]; // Compare la réponse donnée avec la bonne
        if (c.correct) bonnesConnexions++;
    });

    redraw16(); // Met à jour les couleurs des lignes (rouge/bleu)

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




//q17


// Récupération du canvas et de son contexte 2D
const canvas17 = document.getElementById("lignes17");
const ctx17 = canvas17.getContext("2d");

// Ajuste la taille du canvas pour qu'il corresponde exactement au conteneur
// → essentiel pour que les lignes soient dessinées dans la bonne zone
function resizeCanvas17() {
  canvas17.width = document.getElementById("conteneur17").clientWidth;
  canvas17.height = document.getElementById("conteneur17").clientHeight;
}
resizeCanvas17(); // Premier appel (sera corrigé ensuite par showQuestion('q17'))



// Recalcule et redessine les lignes quand la fenêtre change de taille
// → évite que les lignes se décalent si l'utilisateur redimensionne la fenêtre
window.addEventListener("resize", () => {
  resizeCanvas17();
  redraw17();
});

let blocGaucheSelectionne17 = null;   // Stocke le bloc de gauche sélectionné
let connexions17 = [];                // Liste des connexions créées (gauche → droite)

// Sélection des blocs
const blocsGauche17 = document.querySelectorAll(".gauche17 .bloc17");
const blocsDroite17 = document.querySelectorAll(".droite17 .bloc17");

// Fonction pour obtenir le centre d’un bloc
// → permet de tracer une ligne proprement entre deux blocs
function getCenter17(el) {
  const r = el.getBoundingClientRect();
  const cont = document.getElementById("conteneur17").getBoundingClientRect();

  return {
    x: r.left - cont.left + r.width / 2,
    y: r.top - cont.top + r.height / 2
  };
}

// Efface et redessine toutes les lignes existantes
// → appelé après chaque connexion ou redimensionnement
function redraw17() {
  ctx17.clearRect(0, 0, canvas17.width, canvas17.height);
  ctx17.lineWidth = 3;

  connexions17.forEach(c => {
    const blocG = document.querySelector(`.gauche17 .bloc17[data-id="${c.left}"]`);
    const blocD = document.querySelector(`.droite17 .bloc17[data-id="${c.right}"]`);

    const p1 = getCenter17(blocG);
    const p2 = getCenter17(blocD);

    // Rouge si incorrect, bleu sinon
    ctx17.strokeStyle = c.correct === false ? "#e74c3c" : "#3498db";

    ctx17.beginPath();
    ctx17.moveTo(p1.x, p1.y);
    ctx17.lineTo(p2.x, p2.y);
    ctx17.stroke();
  });
}

// Gestion du clic sur les blocs de gauche
blocsGauche17.forEach(bloc => {
  bloc.addEventListener("click", () => {

    // Retire la sélection précédente
    blocsGauche17.forEach(b => b.classList.remove("selected"));

    // Sélectionne le bloc cliqué
    bloc.classList.add("selected");

    // Stocke l'identifiant du bloc sélectionné
    blocGaucheSelectionne17 = bloc.dataset.id;
  });
});

// Gestion du clic sur les blocs de droite
blocsDroite17.forEach(bloc => {
  bloc.addEventListener("click", () => {

    // On ne peut connecter que si un bloc gauche est sélectionné
    if (!blocGaucheSelectionne17) return;

    // Supprime une éventuelle connexion précédente pour ce bloc gauche
    // → garantit qu’un bloc gauche ne peut avoir qu’une seule liaison
    connexions17 = connexions17.filter(c => c.left !== blocGaucheSelectionne17);

    // Ajoute la nouvelle connexion
    connexions17.push({
      left: blocGaucheSelectionne17,
      right: bloc.dataset.id,
      correct: null // sera défini lors de la validation
    });

    // Désélectionne le bloc gauche
    blocsGauche17.forEach(b => b.classList.remove("selected"));
    blocGaucheSelectionne17 = null;

    redraw17(); // Met à jour les lignes affichées
  });
});

// Vérification des réponses
document.getElementById("btn-valider-q17").addEventListener("click", () => {

    const correctMap17 = { A: "2", B: "1", C: "3" }; // Solutions officielles
    let bonnesConnexions = 0;

    // Vérifie chaque connexion
    connexions17.forEach(c => {
        c.correct = c.right === correctMap17[c.left]; // Compare la réponse donnée avec la bonne
        if (c.correct) bonnesConnexions++;
    });

    redraw17(); // Met à jour les couleurs des lignes (rouge/bleu)

    const result = document.getElementById("result-q17");

    // Si toutes les connexions sont correctes
    if (bonnesConnexions === 3) {
        result.textContent = "Bonne réponse !";
        result.style.color = "green";
        score++;
        document.getElementById("btn-valider-q17").style.display = "none";
        document.getElementById("btn-suivant-q17").style.display = "inline-block";
    } else {
        result.textContent = "Mauvaise réponse.";
        result.style.color = "red";
        score--;
    }

    updateScore();
});