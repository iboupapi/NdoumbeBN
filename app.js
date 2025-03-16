const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http'); // Pour créer un serveur HTTP
const { Server } = require('socket.io'); // Pour intégrer Socket.IO
const jwt = require('jsonwebtoken');
const users = {};

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();
const port = process.env.PORT || 3000;

// Créer le serveur HTTP et intégrer Socket.IO
const server = http.createServer(app);
const io = new Server(server);

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
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Définir les routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const likeRoutes = require('./routes/like');
const profileRoutes = require('./routes/profile');
const followRoutes = require('./routes/follow');

app.use('/follows', followRoutes);
app.use('/', profileRoutes);
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/likes', likeRoutes);

// Route de la page d'accueil
app.get('/', (req, res) => {
    res.render('index');
});

// Route pour le chat en temps réel
app.get('/chat/:id', (req, res) => {
  const currentUserId = req.session.userId; // L'utilisateur connecté
  const currentUsername = req.session.username; // Ajoute cette info à la session
  const targetUserId = req.params.id; // L'utilisateur cible avec qui chatter

  if (!currentUserId) {
      return res.redirect('/auth/login'); // Redirection si non connecté
  }

  // Vérifie si le token de l'utilisateur est déjà dans la session
  let token = req.session.token;
  if (!token) {
      // Génère un nouveau token JWT
      token = jwt.sign(
          { userId: currentUserId },
          process.env.JWT_SECRET, // Remplace par ta clé secrète
          { expiresIn: '1h' }
      );
      req.session.token = token; // Sauvegarde le token dans la session
  }

  res.render('privateChat', {
    currentUserId,
    currentUsername: req.session.username, // Passe le nom d'utilisateur ici
    targetUserId,
    token: req.session.token
});
});


app.get('/conversations', (req, res) => {
  const currentUserId = req.session.userId;
  const query = `
      SELECT DISTINCT room_id, sender_id, content, timestamp
      FROM messages
      WHERE sender_id = ? OR room_id LIKE CONCAT('%', ?, '%')
      ORDER BY timestamp DESC
  `;
  db.query(query, [currentUserId, currentUserId], (err, conversations) => {
      if (err) return res.status(500).send('Erreur serveur');
      res.render('conversations', { conversations });
  });
});



io.on('connection', (socket) => {
  console.log('Un utilisateur s\'est connecté :', socket.id);

  // Rejoindre une salle privée et récupérer l'historique des messages
  socket.on('join room', (data) => {
      const { roomId, userId, username } = data;
      users[socket.id] = { userId, username }; // Stocke les infos utilisateur
      socket.join(roomId);
      console.log(`${username} a rejoint la salle : ${roomId}`);

      // Charger l'historique des messages avec les noms des expéditeurs
      const query = `
          SELECT messages.sender_id, messages.content, messages.timestamp, users.username
          FROM messages
          JOIN users ON messages.sender_id = users.id
          WHERE messages.room_id = ?
          ORDER BY messages.timestamp ASC
      `;
      db.query(query, [roomId], (err, messages) => {
          if (err) {
              console.error(err);
              return;
          }
          socket.emit('chat history', messages); // Envoie les messages avec noms
      });
  });

  // Gestion de l'envoi des messages
  socket.on('chat message', (data) => {
      jwt.verify(data.token, 'votre_clé_secrète', (err, decoded) => {
          if (err) {
              console.error('Token invalide');
              return;
          }

          const user = users[socket.id]; // Vérifie l'utilisateur connecté
          if (!user) {
              console.error('Utilisateur inconnu pour le socket ID :', socket.id);
              return;
          }

          // Enregistre le message
          const queryInsert = `INSERT INTO messages (room_id, sender_id, content) VALUES (?, ?, ?)`;
          db.query(queryInsert, [data.roomId, decoded.userId, data.message], (err) => {
              if (err) {
                  console.error('Erreur lors de l\'enregistrement du message :', err);
                  return;
              }

              // Diffuse le message à tous les utilisateurs dans la salle
              io.to(data.roomId).emit('chat message', {
                  sender: user.username, // Envoie le nom d'utilisateur
                  message: data.message
              });
          });
      });
  });

  // Gestion de la déconnexion
  socket.on('disconnect', () => {
      const user = users[socket.id];
      if (user) {
          console.log(`Utilisateur déconnecté : ${user.username} (${socket.id})`);
          delete users[socket.id];
      }
  });
});






// Lancer le serveur avec Socket.IO
server.listen(port, () => {
    console.log(`Serveur démarré avec Socket.IO sur http://localhost:${port}`);
});
