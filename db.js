const mysql = require('mysql');

// Configuration de la connexion
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // Ton utilisateur MySQL
  password: '',       // Ton mot de passe MySQL
  database: 'projetBN' // Le nom de ta base de données
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion : ' + err.stack);
    return;
  }
  console.log('Connecté à la base de données MySQL en tant que id ' + db.threadId);
});

module.exports = db;
