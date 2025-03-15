const express = require('express');
const router = express.Router();
const db = require('../db'); // Assurez-vous que vous utilisez votre module de base de données

router.get('/profile/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10); // Convertit l'ID en entier pour éviter les erreurs

    if (isNaN(userId)) {
        return res.status(400).send('ID utilisateur invalide.');
    }

    const query = 'SELECT * FROM users WHERE id = ?';

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur du serveur.');
        }

        if (result.length === 0) {
            return res.status(404).send('Utilisateur introuvable.');
        }

        const user = result[0];
        res.render('profile', { user }); // Passe les données utilisateur à la vue
    });
    console.log('Accès à la route profile avec ID :', req.params.id);
});

module.exports = router;
