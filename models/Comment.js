const db = require('../db');

// Créer un nouveau commentaire
exports.createComment = (comment, callback) => {
  const query = 'INSERT INTO comments (content, post_id, user_id) VALUES (?, ?, ?)';
  db.query(query, [comment.content, comment.post_id, comment.user_id], callback);
};

// Récupérer les commentaires par post ID
exports.getCommentsByPostId = (postId, callback) => {
  const query = 'SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.post_id = ?';
  db.query(query, [postId], callback);
};
