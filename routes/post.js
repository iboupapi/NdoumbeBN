const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Route pour afficher la page de création d'un post (createPost.ejs)
router.get('/create', (req, res) => {
    res.render('createPost'); // Vue pour créer un post
});

// Route pour afficher tous les posts (feed.ejs)
router.get('/', (req, res) => {
    Post.getAllPosts((err, results) => {
        if (err) throw err;
        console.log('Posts:', results); // Debug : Vérifiez si les résultats contiennent les IDs
        res.render('feed', { posts: results });
    });
});

// Route pour créer un nouveau post
router.post('/create', (req, res) => {
    const { content } = req.body; // Seuls `content` et `userId` sont nécessaires
    const userId = req.session.userId;

    console.log('content:', content);
    console.log('userId:', userId);

    if (!content || !userId) {
        return res.status(400).send('Données invalides.');
    }

    const newPost = { content, user_id: userId };

    Post.createPost(newPost, (err, result) => {
        if (err) throw err;
        res.redirect('/posts'); // Redirige vers la liste des posts
    });
});

// Route pour afficher un post spécifique avec ses commentaires (post.ejs)
router.get('/:id', (req, res) => {
    const postId = req.params.id;

    console.log('postId:', postId); // Debug : Vérifiez si l'ID est passé correctement

    if (!postId || isNaN(postId)) {
        return res.status(400).send('ID de post invalide.');
    }

    Post.getPostById(postId, (err, postResult) => {
        if (err) throw err;

        if (postResult.length === 0) {
            return res.status(404).send('Post introuvable.');
        }

        const post = postResult[0];
        Comment.getCommentsByPostId(postId, (err, commentsResult) => {
            if (err) throw err;

            res.render('post', { post, comments: commentsResult });
        });
    });
});

module.exports = router;
