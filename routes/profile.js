const express = require('express');
const router = express.Router();
const db = require('../db'); // Connexion à la base de données

// Afficher le profil d'un utilisateur
router.get('/profile/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10); // ID de l'utilisateur affiché
    const currentUserId = req.session.userId; // ID de l'utilisateur connecté

    if (isNaN(userId)) {
        return res.status(400).send('ID utilisateur invalide.');
    }

    const queryUser = 'SELECT * FROM users WHERE id = ?';
    const queryFollowerCount = 'SELECT COUNT(*) AS follower_count FROM follows WHERE followed_id = ?';
    const queryFollowingCount = 'SELECT COUNT(*) AS following_count FROM follows WHERE follower_id = ?';
    const queryIsFollowing = 'SELECT COUNT(*) AS is_following FROM follows WHERE follower_id = ? AND followed_id = ?';

    // Récupérer les informations de l'utilisateur
    db.query(queryUser, [userId], (err, userResult) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur du serveur.');
        }
        if (userResult.length === 0) {
            return res.status(404).send('Utilisateur introuvable.');
        }

        const user = userResult[0];

        // Récupérer les données supplémentaires (followers, following, statut suivant)
        db.query(queryFollowerCount, [userId], (err, followerResult) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Erreur du serveur.');
            }
            const followerCount = followerResult[0].follower_count;

            db.query(queryFollowingCount, [userId], (err, followingResult) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erreur du serveur.');
                }
                const followingCount = followingResult[0].following_count;

                db.query(queryIsFollowing, [currentUserId, userId], (err, isFollowingResult) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Erreur du serveur.');
                    }
                    const isFollowing = isFollowingResult[0].is_following > 0;

                    res.render('profile', {
                        user,
                        followerCount,
                        followingCount,
                        isFollowing
                    });
                });
            });
        });
    });
});

// Suivre un utilisateur
router.post('/profile/:id/follow', (req, res) => {
    const followedId = parseInt(req.params.id, 10); // ID de l'utilisateur à suivre
    const followerId = req.session.userId; // ID de l'utilisateur connecté

    if (!followerId) {
        return res.status(401).send('Vous devez être connecté pour suivre quelqu\'un.');
    }

    const query = 'INSERT INTO follows (follower_id, followed_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id';

    db.query(query, [followerId, followedId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur du serveur.');
        }
        res.json({ success: true, message: 'Utilisateur suivi avec succès.' });
    });
});

// Ne plus suivre un utilisateur
router.post('/profile/:id/unfollow', (req, res) => {
    const followedId = parseInt(req.params.id, 10); // ID de l'utilisateur à ne plus suivre
    const followerId = req.session.userId; // ID de l'utilisateur connecté

    if (!followerId) {
        return res.status(401).send('Vous devez être connecté pour ne plus suivre quelqu\'un.');
    }

    const query = 'DELETE FROM follows WHERE follower_id = ? AND followed_id = ?';

    db.query(query, [followerId, followedId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur du serveur.');
        }
        res.json({ success: true, message: 'Utilisateur non suivi avec succès.' });
    });
});

module.exports = router;
