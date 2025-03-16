const express = require('express');
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http'); 
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

// Charger les variables d'environnement
dotenv.config();

// Initialiser l'application Express
const app = express();
const port = process.env.PORT || 3000;

// Créer le serveur HTTP et intégrer Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Configuration de la base de données
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
    secret: 'votre_secret', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Importer les routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const likeRoutes = require('./routes/like');
const profileRoutes = require('./routes/profile');
const followRoutes = require('./routes/follow');

// Utiliser les routes
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

// Charger les messages existants pour une room
app.get('/messages/:roomId', (req, res) => {
    const { roomId } = req.params;
    db.query(
        'SELECT * FROM messages WHERE room_id = ? ORDER BY created_at ASC',
        [roomId],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Erreur lors du chargement des messages' });
            res.json(results);
        }
    );
});

// Route pour le chat en temps réel
app.get('/chat/:roomId', (req, res) => {
    const currentUserId = req.session.userId;
    const roomIdParts = req.params.roomId.split('_');

    if (!currentUserId) {
        return res.redirect('/auth/login'); // Redirection si non connecté
    }

    // Identifier le targetUserId en s'assurant que le roomId contient exactement deux IDs
    const targetUserId = roomIdParts.find(id => id !== String(currentUserId));

    // Vérification pour éviter toute erreur
    if (!targetUserId) {
        return res.status(400).send('Identifiant utilisateur invalide.');
    }

    // Générer un token JWT s'il n'existe pas
    let token = req.session.token;
    if (!token) {
        token = jwt.sign(
            { userId: currentUserId },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        req.session.token = token; 
    }

    res.render('privateChat', {
        currentUserId,
        currentUsername: req.session.username,
        targetUserId,
        token
    });
    console.log('Room ID:', req.params.roomId);
console.log('Current User ID:', currentUserId);
console.log('Target User ID:', targetUserId);
});


// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
    console.log('Un utilisateur est connecté :', socket.id);

    // Rejoindre une salle
    socket.on('join room', ({ roomId, userId }) => {
        socket.join(roomId);
        console.log(`Utilisateur ${userId} a rejoint la salle ${roomId}`);
    });

    // Envoi d'un message
    socket.on('chat message', (data) => {
        const { roomId, senderId, receiverId, message } = data;
        // Log des données reçues pour débogage
    console.log('Données reçues :', { roomId, senderId, receiverId, message });

    if (!senderId || !receiverId) {
        console.error('Les informations de l\'expéditeur ou du destinataire sont manquantes.');
        return;
    }
        // Sauvegarder le message dans la base de données
        const query = 'INSERT INTO messages (room_id, sender_id, receiver_id, content) VALUES (?, ?, ?, ?)';
        db.query(query, [roomId, senderId, receiverId, message], (err) => {
            
            if (!senderId || !receiverId || !message) {
                console.error('Erreur : Les informations sont incomplètes.');
                return;
            }
            
            if (err) {
                console.error('Erreur lors de l\'enregistrement du message :', err);
                return;
            }

            // Envoyer le message à tous les utilisateurs de la salle
            io.to(roomId).emit('chat message', {
                senderId,
                message
            });
        });
    });

    // Gérer les déconnexions
    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté :', socket.id);
    });
});

// Lancer le serveur
server.listen(port, () => {
    console.log(`Serveur démarré avec Socket.IO sur http://localhost:${port}`);
});
