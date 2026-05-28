# Site-Sensibilisation

Mini learning questionnaire pour la sensibilisation à la cybersécurité.

## Structure du projet

- `Questionnaire/` : pages HTML et scripts pour les niveaux Facile, Moyen et Difficile
- `backend/` : serveur Node.js minimal pour enregistrer les scores
- `backend/db.json` : stockage local des scores

## Sécurité du score

Le backend ne doit pas faire confiance aux données envoyées par le navigateur. Dans `backend/server.js` :

- le `niveau` est vérifié (`Facile`, `Moyen`, `Difficile`)
- le `total` est fixé côté serveur et ne peut pas être modifié par le client
- le `score` est validé pour être un entier entre `0` et le total attendu

Cela évite qu'un utilisateur envoie un score trop élevé ou un total modifié.

## Installation

1. Ouvrir un terminal dans le dossier `backend/`
2. Installer les dépendances :

```bash
npm install
```

3. Démarrer le serveur :

```bash
npm start
```

Le serveur tourne ensuite sur `http://localhost:3001`.

## Lancer le site en local

Le site peut être ouvert directement depuis les fichiers HTML :

- `Questionnaire/facile.html`
- `Questionnaire/moyen.html`
- `Questionnaire/difficile.html`

Pour un meilleur fonctionnement, servez le dossier `Questionnaire/` via un serveur local (par exemple `live-server`, `http-server`, ou depuis un IDE) afin d'éviter les problèmes de politique CORS.

## Déploiement

### Option 1 : déploiement simple avec backend Node.js

1. Héberger le backend sur une plateforme Node.js (Render, Railway, Heroku, etc.)
2. Configurer l'URL du backend dans les fichiers JS si nécessaire
3. Servir les fichiers HTML depuis un hébergeur statique ou depuis le même serveur Node.js

### Option 2 : déploiement statique + backend séparé

- héberger `Questionnaire/` sur GitHub Pages, Netlify, Vercel ou un hébergeur de fichiers statiques
- héberger le backend `backend/` sur une instance Node.js
- configurer CORS si le frontend et le backend sont sur des domaines différents

## Rappels importants

- La validation de score est plus sûre côté serveur
- Le frontend ne doit pas être la seule source de vérité
- Pour aller plus loin, le backend peut recevoir les réponses du quiz et recalculer le score lui-même
- Le backend actuel stocke les scores dans `backend/db.json`

