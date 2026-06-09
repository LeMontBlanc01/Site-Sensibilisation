const express = require('express');
const cors = require('cors');
const fs = require('fs');
const quizConfig = require('./quizConfig');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = './db.json';
const TOTAL_BY_LEVEL = {
    Facile: 18,
    moyen: 18,
    Difficile: 18,
};

const arraysEqual = (a, b) => a.length === b.length && a.every(v => b.includes(v));


if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ scores: [] }));
}

app.post('/api/verify-question', (req, res) => {
    const { nom, niveau, questionId, reponsesUtilisateur } = req.body;
    const exactKey = Object.keys(quizConfig).find(k => k.toLowerCase() === (niveau || '').toLowerCase()) || niveau;
    const config = quizConfig[exactKey];

    if (!config) {
        return res.status(400).json({ error: `Configuration introuvable pour le niveau : ${niveau}` });
    }


    const questionNum = questionId.replace('q', '');
    const num = parseInt(questionNum);
    let isCorrect = false;

    if (num >= 15 && num <= 17) {
        const bonnesReponses = config.matchingQuestions[num].correctMap;
        let bonnesConnexions = 0;
        if (reponsesUtilisateur && Array.isArray(reponsesUtilisateur)) {
            reponsesUtilisateur.forEach(conn => {
                if (bonnesReponses[conn.left] === conn.right) bonnesConnexions++;
            });
        }
        if (bonnesConnexions === 3) isCorrect = true;

    } else {
        const bonnesReponses = config.questions[questionId]?.correct || [];
        if (reponsesUtilisateur && Array.isArray(reponsesUtilisateur)) {
            isCorrect = arraysEqual(reponsesUtilisateur, bonnesReponses);
        }
    }

    const explication = isCorrect 
        ? config.explications.bonnes[questionNum] 
        : config.explications.mauvaises[questionNum];

    res.json({
        correct: isCorrect,
        explication: explication
    });
});

app.post('/api/scores', (req, res) => {
    const { nom, score, niveau, total } = req.body;

    if (!nom || score === undefined || !niveau) {
        return res.status(400).json({ error: 'Nom, score et niveau sont requis' });
    }

    if (!Object.prototype.hasOwnProperty.call(TOTAL_BY_LEVEL, niveau)) {
        return res.status(400).json({ error: 'Niveau invalide' });
    }

    const expectedTotal = TOTAL_BY_LEVEL[niveau];
    if (!Number.isInteger(score) || score < 0 || score > expectedTotal) {
        return res.status(400).json({ error: 'Score invalide' });
    }

    if (total !== undefined && total !== expectedTotal) {
        return res.status(400).json({ error: 'Total invalide' });
    }

    const db = JSON.parse(fs.readFileSync(DB_PATH));
    db.scores.push({
        nom,
        score,
        niveau,
        total: expectedTotal,
        date: new Date().toLocaleDateString('fr-FR'),
    });

    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.json({ message: 'Score enregistré avec succès' });
});

app.get('/api/scores', (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH));
    res.json(db.scores);
});

app.listen(3001, () => {
    console.log('Server is running on port 3001 on http://localhost:3001');
});