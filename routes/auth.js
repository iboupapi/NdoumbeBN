const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Connexion à la base de données
require('dotenv').config(); // Charger les variables d'environnement

// Page d'inscription
router.get('/register', (req, res) => res.render('register'));

// Inscription utilisateur
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('Tous les champs sont requis.');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
        db.query(query, [username, email, hashedPassword], (err) => {
            if (err) {
                console.error('Erreur lors de l\'inscription :', err);
                return res.status(500).send('Erreur lors de l\'inscription');
            }
            res.redirect('/auth/login');
        });
    } catch (err) {
        console.error('Erreur :', err);
        res.status(500).send('Erreur serveur');
    }
});

// Page de connexion
router.get('/login', (req, res) => res.render('login'));

// Connexion utilisateur
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email et mot de passe sont requis.');
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Erreur serveur :', err);
            return res.status(500).send('Erreur serveur.');
        }

        if (results.length > 0) {
            const user = results[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                req.session.userId = user.id;
                req.session.username = user.username;

                const token = jwt.sign(
                    { userId: user.id },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                req.session.token = token;
                return res.redirect('/');
            } else {
                return res.status(401).send('Mot de passe incorrect.');
            }
        } else {
            return res.status(404).send('Utilisateur non trouvé.');
        }
    });
});

// Déconnexion
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erreur lors de la déconnexion :', err);
        }
        res.redirect('/auth/login');
    });
});

module.exports = router;
