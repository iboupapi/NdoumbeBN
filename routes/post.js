const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', (req, res) => {
  Post.getAllPosts((err, results) => {
    if (err) throw err;
    res.render('feed', { posts: results });
  });
});

router.post('/create', (req, res) => {
  const { content } = req.body;
  const userId = req.session.userId;
  const newPost = { content, user_id: userId };

  Post.createPost(newPost, (err, result) => {
    if (err) throw err;
    res.redirect('/posts');
  });
});

router.get('/:id', (req, res) => {
  const postId = req.params.id;

  Post.getPostById(postId, (err, postResult) => {
    if (err) throw err;
    const post = postResult[0];
    Comment.getCommentsByPostId(postId, (err, commentsResult) => {
      if (err) throw err;
      res.render('post', { post, comments: commentsResult });
    });
  });
});

module.exports = router;
