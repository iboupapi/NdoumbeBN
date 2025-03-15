const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const multer = require('multer');
const path = require('path');

// Configuration pour stocker les fichiers dans un dossier "uploads"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Chemin où les images seront stockées
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nomme les fichiers avec un horodatage
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5 Mo par fichier
    fileFilter: function (req, file, cb) {
        // Valide uniquement les images
        const fileTypes = /jpeg|jpg|png|gif/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extName && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Seuls les fichiers JPEG, PNG, et GIF sont autorisés.'));
        }
    }
});

// Route pour afficher la page de création d'un post (createPost.ejs)
router.get('/create', (req, res) => {
    res.render('createPost'); // Vue pour créer un post
});

router.post('/create', upload.single('image'), (req, res) => {
    const { content } = req.body; // Contenu textuel
    const userId = req.session.userId; // ID de l'utilisateur connecté
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Chemin de l'image

    console.log('Contenu :', content);
    console.log('Utilisateur :', userId);
    console.log('Image :', image);

    if (!content || !userId) {
        return res.status(400).send('Données invalides.');
    }

    const newPost = { content, user_id: userId, image };

    // Appelle la méthode pour insérer le post dans la base de données
    Post.createPost(newPost, (err, result) => {
        if (err) throw err;
        res.redirect('/posts'); // Redirige vers la page des posts
    });
});

// Route pour afficher tous les posts (feed.ejs)
router.get('/', (req, res) => {
    Post.getAllPosts((err, results) => {
        if (err) throw err;
        res.render('feed', { posts: results });
    });
});

// Route pour créer un nouveau post
router.post('/create', upload.single('image'), (req, res) => {
    console.log('Corps de la requête (req.body) :', req.body);
    console.log('Fichier reçu (req.file) :', req.file); // Vérifie si multer traite l'image correctement
    const { content } = req.body;
    const userId = req.session.userId;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Chemin de l'image

    console.log('Données du post :', { content, userId, image });

    if (!content || !userId) {
        return res.status(400).send('Données invalides.');
    }

    const newPost = { content, user_id: userId, image };

    // Appelle la méthode pour insérer dans la base
    Post.createPost(newPost, (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion du post :', err);
            return res.status(500).send('Erreur du serveur.');
        }
        res.redirect('/posts');
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
