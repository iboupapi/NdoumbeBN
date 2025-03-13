const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();
const port = process.env.PORT || 3000;

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('Connecté à la base de données MySQL');
});

// Configurer les middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'votre_secret', // Utilise une chaîne secrète pour signer les cookies de session
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Mettre à true en production avec HTTPS
}));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Définir les routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const likeRoutes = require('./routes/like');

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/likes', likeRoutes);

// Route de la page d'accueil
app.get('/', (req, res) => {
  res.render('index');
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});


