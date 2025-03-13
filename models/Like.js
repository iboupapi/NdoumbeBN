const db = require('../db');

// Ajouter un like
exports.addLike = (like, callback) => {
  const query = 'INSERT INTO likes (post_id, user_id) VALUES (?, ?)';
  db.query(query, [like.post_id, like.user_id], callback);
};

// Récupérer les likes par post ID
exports.getLikesByPostId = (postId, callback) => {
  const query = 'SELECT * FROM likes WHERE post_id = ?';
  db.query(query, [postId], callback);
};
