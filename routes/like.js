const express = require('express');
const router = express.Router();
const db = require('../db');

// Route pour liker un post
router.post('/like', (req, res) => {
  const { post_id } = req.body;
  const user_id = req.session.userId;

  if (!user_id) {
      return res.status(401).json({ success: false, message: 'Vous devez être connecté pour aimer un post.' });
  }

  const queryInsert = `INSERT INTO likes (post_id, user_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=id`;
  const queryCount = `SELECT COUNT(*) AS like_count FROM likes WHERE post_id = ?`;

  db.query(queryInsert, [post_id, user_id], (err) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: 'Erreur serveur.' });
      }

      // Compte les likes après l'insertion
      db.query(queryCount, [post_id], (err, results) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ success: false, message: 'Erreur serveur.' });
          }

          const like_count = results[0].like_count;
          res.json({ success: true, like_count });
      });
  });
});


// Route pour annuler un like
router.post('/unlike', (req, res) => {
  const { post_id } = req.body;
  const user_id = req.session.userId;

  if (!user_id) {
      return res.status(401).json({ success: false, message: 'Vous devez être connecté pour annuler un like.' });
  }

  const queryDelete = `DELETE FROM likes WHERE post_id = ? AND user_id = ?`;
  const queryCount = `SELECT COUNT(*) AS like_count FROM likes WHERE post_id = ?`;

  db.query(queryDelete, [post_id, user_id], (err) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: 'Erreur serveur.' });
      }

      // Compte les likes après suppression
      db.query(queryCount, [post_id], (err, results) => {
          if (err) {
              console.error(err);
              return res.status(500).json({ success: false, message: 'Erreur serveur.' });
          }

          const like_count = results[0].like_count;
          res.json({ success: true, like_count });
      });
  });
});

module.exports = router;
