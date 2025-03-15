const db = require('../db');

// Récupérer le nombre de followers d'un utilisateur
exports.getFollowerCount = (user_id, callback) => {
    const query = `SELECT COUNT(*) AS follower_count FROM follows WHERE followed_id = ?`;
    db.query(query, [user_id], callback);
};

// Récupérer le nombre de comptes suivis par un utilisateur (following)
exports.getFollowingCount = (user_id, callback) => {
    const query = `SELECT COUNT(*) AS following_count FROM follows WHERE follower_id = ?`;
    db.query(query, [user_id], callback);
};

// Vérifier si l'utilisateur actuel suit une autre personne
exports.isFollowing = (follower_id, followed_id, callback) => {
    const query = `SELECT COUNT(*) AS is_following FROM follows WHERE follower_id = ? AND followed_id = ?`;
    db.query(query, [follower_id, followed_id], callback);
};
