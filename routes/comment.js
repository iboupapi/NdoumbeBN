const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

router.post('/create', async (req, res) => {
  try {
    const { content, postId } = req.body;
    console.log('postId:', postId); // Debug : Vérifie si postId est reçu
    console.log('content:', content);

    if (!postId || !content) {
        return res.status(400).send('Données de commentaire invalides.');
    }
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).send('Utilisateur non connecté.');
    }
    if (!content || !postId) {
      return res.status(400).send('Données de commentaire invalides.');
    }
    const newComment = { content, post_id: postId, user_id: userId };

    await Comment.createComment(newComment);
    res.redirect(`/posts/${postId}`);
    console.log(postId);
  } catch (err) {
    res.status(500).send('Erreur du serveur.');
  }
});


module.exports = router;
