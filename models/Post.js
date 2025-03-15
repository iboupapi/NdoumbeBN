const db = require('../db');

// Créer un nouveau post
exports.createPost = (post, callback) => {
  const query = `INSERT INTO posts (content, user_id, image) VALUES (?, ?, ?)`;
  db.query(query, [post.content, post.user_id, post.image], callback);
};
// Récupérer tous les posts
exports.getAllPosts = (callback) => {
  const query = `
  SELECT posts.*, users.username, 
  (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS like_count
  FROM posts
  JOIN users ON posts.user_id = users.id
`;  db.query(query, callback);
};

// Récupérer un post par ID
exports.getPostById = (id, callback) => {
  const query = `SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?`;
  db.query(query, [id], callback);
};
