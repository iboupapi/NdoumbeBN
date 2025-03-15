const db = require('../db');

// Insérer un nouvel utilisateur
exports.createUser = (user, callback) => {
  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(query, [user.username, user.email, user.password], callback);
};

// Récupérer un utilisateur par email
exports.getUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], callback);
};

// Récupérer un utilisateur par ID
exports.getUserById = (id, callback) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [id], callback);
};
//profile
exports.getUserById = (id, callback) => {
  const query = `SELECT * FROM users WHERE id = ?`;
  db.query(query, [id], callback);
};
