const express = require('express');
const router = express.Router();
const Like = require('../models/Like');

router.post('/create', (req, res) => {
  const { postId } = req.body;
  const userId = req.session.userId;
  const newLike = { post_id: postId, user_id: userId };

  Like.addLike(newLike, (err, result) => {
    if (err) throw err;
    res.redirect(`/posts/${postId}`);
  });
});

module.exports = router;
