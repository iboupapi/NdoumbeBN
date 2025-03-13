const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db'); // Assurez-vous d'importer votre connexion à la base de données
const User = require('../models/user'); // Modèle utilisateur
// Page d'inscription
router.get('/register', (req, res) => res.render('register'));

// Inscription utilisateur
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, email, password: hashedPassword };
  
    User.createUser(newUser, (err, result) => {
      if (err) throw err;
      res.redirect('/auth/login');
    });
  });

// Page de connexion
router.get('/login', (req, res) => res.render('login'));

// Connexion utilisateur
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.userId = user.id;
        res.redirect('/');
      } else {
        res.redirect('/auth/login');
      }
    } else {
      res.redirect('/auth/login');
    }
  });
});

// Déconnexion
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/auth/login');
  });
});

module.exports = router;