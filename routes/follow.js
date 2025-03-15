const express = require('express');
const router = express.Router();
const db = require('../db');

// Route pour suivre un utilisateur
router.post('/follow', (req, res) => {
    const { followed_id } = req.body; // ID de l'utilisateur à suivre
    const follower_id = req.session.userId; // ID de l'utilisateur connecté

    if (!follower_id) {
        return res.status(401).json({ success: false, message: 'Vous devez être connecté pour suivre quelqu\'un.' });
    }

    const queryInsert = `INSERT INTO follows (follower_id, followed_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id`;
    db.query(queryInsert, [follower_id, followed_id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Erreur serveur.' });
        }
        res.json({ success: true, message: 'Utilisateur suivi avec succès.' });
    });
});

// Route pour ne plus suivre un utilisateur
router.post('/unfollow', (req, res) => {
    const { followed_id } = req.body;
    const follower_id = req.session.userId;

    if (!follower_id) {
        return res.status(401).json({ success: false, message: 'Vous devez être connecté pour ne plus suivre quelqu\'un.' });
    }

    const queryDelete = `DELETE FROM follows WHERE follower_id = ? AND followed_id = ?`;
    db.query(queryDelete, [follower_id, followed_id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Erreur serveur.' });
        }
        res.json({ success: true, message: 'Utilisateur non suivi avec succès.' });
    });
});

module.exports = router;
