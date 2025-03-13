const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

router.post('/create', (req, res) => {
  const { content, postId } = req.body;
  const userId = req.session.userId;
  const newComment = { content, post_id: postId, user_id: userId };

  Comment.createComment(newComment, (err, result) => {
    if (err) throw err;
    res.redirect(`/posts/${postId}`);
  });
});

module.exports = router;
