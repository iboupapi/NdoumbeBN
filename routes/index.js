const express = require('express');
const router = express.Router();
const db = require('../db');

// Page d'accueil
router.get('/', (req, res) => {
  res.render('index');
});

// Page de création de post
router.get('/posts/create', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }
  res.render('post');
});

// Page pour afficher tous les posts
router.get('/posts', (req, res) => {
  const query = 'SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.render('feed', { posts: results });
  });
});

// Page pour afficher un post spécifique avec ses commentaires
router.get('/posts/:id', (req, res) => {
  const postId = req.params.id;
  const queryPost = 'SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?';
  const queryComments = 'SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.post_id = ?';

  db.query(queryPost, [postId], (err, postResult) => {
    if (err) throw err;
    const post = postResult[0];

    db.query(queryComments, [postId], (err, commentsResult) => {
      if (err) throw err;
      res.render('post', { post, comments: commentsResult });
    });
  });
});

module.exports = router;