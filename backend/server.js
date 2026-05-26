const express = require('express');
const cors = require('cors');
const fs = require('fs'); 

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = './db.json';

if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ scores: [] }));
}

app.post('/api/scores', (req, res) => {
    const { nom, score, niveau, total } = req.body;

    if (!nom || score === undefined || !niveau) {
        return res.status(400).json({ error: 'Nom, score et niveau sont requis' });
    }

    const db = JSON.parse(fs.readFileSync(DB_PATH));
    db.scores.push({
        nom,
        score,
        niveau,
        total,
        date: new Date().toLocaleDateString('fr-FR')
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