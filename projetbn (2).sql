-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 27 avr. 2026 à 18:17
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `projetbn`
--

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `content` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `comments`
--

INSERT INTO `comments` (`id`, `post_id`, `user_id`, `comment`, `created_at`, `content`) VALUES
(10, 15, 9, '', '2025-03-18 06:12:18', 'Super !'),
(11, 15, 10, '', '2025-03-18 06:19:38', 'nice !'),
(12, 18, 5, '', '2025-03-27 13:07:04', 'nice !'),
(13, 18, 11, '', '2025-04-10 13:54:11', 'bien'),
(14, 15, 4, '', '2025-04-14 12:49:46', 'bonjour'),
(15, 15, 4, '', '2025-04-14 13:03:02', 'jk'),
(16, 21, 13, '', '2026-04-27 12:52:01', 'bonjour');

-- --------------------------------------------------------

--
-- Structure de la table `followers`
--

CREATE TABLE `followers` (
  `id` int(11) NOT NULL,
  `follower_id` int(11) NOT NULL,
  `following_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `follows`
--

CREATE TABLE `follows` (
  `id` int(11) NOT NULL,
  `follower_id` int(11) NOT NULL,
  `followed_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `follows`
--

INSERT INTO `follows` (`id`, `follower_id`, `followed_id`, `created_at`) VALUES
(1, 1, 1, '2025-03-15 03:14:17'),
(2, 2, 1, '2025-03-15 03:15:07'),
(5, 4, 5, '2025-03-17 18:14:18'),
(6, 1, 5, '2025-03-17 18:14:49'),
(7, 9, 3, '2025-03-18 06:12:39'),
(8, 10, 3, '2025-03-18 06:19:56');

-- --------------------------------------------------------

--
-- Structure de la table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `likes`
--

INSERT INTO `likes` (`id`, `post_id`, `user_id`) VALUES
(49, 15, 1),
(52, 15, 2),
(50, 15, 3),
(55, 15, 9),
(58, 15, 10),
(72, 15, 13),
(62, 16, 1),
(53, 16, 2),
(51, 16, 3),
(68, 16, 4),
(56, 16, 9),
(59, 16, 10),
(54, 17, 2),
(57, 17, 9),
(67, 18, 4),
(64, 18, 5),
(65, 18, 11),
(73, 21, 13);

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `room_id` varchar(255) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `room_id`, `sender_id`, `receiver_id`, `content`, `created_at`) VALUES
(1, '7_5', 7, 5, 'xc', '2025-03-16 20:27:44'),
(2, '7_5', 7, 5, 'xxc', '2025-03-16 20:27:52'),
(3, '7_5', 7, 5, 'fff', '2025-03-16 20:30:17'),
(4, '7_5', 7, 5, 'gff', '2025-03-16 20:32:36');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `video` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `title`, `content`, `image`, `created_at`, `video`) VALUES
(15, 1, '', 'Le moringa, surnommé « arbre miracle », est une véritable mine de nutriments comme les vitamines, le fer et le calcium, idéal pour renforcer ton corps. Il combat les inflammations, réduit le sucre et le cholestérol dans le sang, et booste les défenses antioxydantes. En plus, il aide à détoxifier l’organisme et peut même purifier l’eau grâce à ses graines ! Pratique et bénéfique, il s’intègre facilement à ton alimentation quotidienne. ???? Si tu veux en savoir plus, je suis là !', '/uploads/1742277567103.jpg', '2025-03-18 05:59:27', NULL),
(16, 3, '', 'Manger équilibré, c\'est privilégier une assiette variée avec des légumes, des fruits, des protéines (animales ou végétales), des glucides complexes et de bonnes graisses. Cela permet d’apporter à ton corps tous les nutriments essentiels pour fonctionner au mieux et prévenir les carences. Pense aussi à bien hydrater ton corps avec de l’eau, et à limiter les aliments transformés riches en sucres et en gras saturés. En adoptant cette habitude, tu favorises ton énergie, ta digestion et ta santé globale ! ????', '/uploads/1742277913560.jpg', '2025-03-18 06:05:13', NULL),
(17, 2, '', 'Les thés et infusions offrent de nombreux bienfaits : ils hydratent le corps tout en apportant des antioxydants qui protègent les cellules. Certaines infusions, comme celles au gingembre ou au kinkeliba, aident à la digestion et réduisent les inflammations. Elles peuvent aussi calmer l\'esprit et améliorer le sommeil, comme celles à base de camomille. De plus, boire une infusion chaude est un excellent moyen de se détendre et de prendre soin de soi au quotidien.', '/uploads/1742278190072.jpeg', '2025-03-18 06:09:50', NULL),
(18, 5, '', 'description', '/uploads/1743080764308.jpg', '2025-03-27 13:06:04', NULL),
(19, 4, '', 'bonjour', '/uploads/1744634962893.png', '2025-04-14 12:49:22', NULL),
(20, 4, '', 'jlm', '/uploads/1744635770026.png', '2025-04-14 13:02:50', NULL),
(21, 13, '', 'srDJzryk', '/uploads/1777294300728.png', '2026-04-27 12:51:40', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'Ibrahima', 'iboupapi95@gmail.com', '$2b$10$VIf0gbErV54dZQqg4nZAnONigd38brx9/GtS68BwA7kJMUtPqV9Qu', '2025-03-13 12:28:17'),
(2, 'Mousssa Seck', 'moussa.seck13@unchk.edu.sn', '$2b$10$J.IWYXfdhLNcxaPgX22Mqe.lZStci1XWwpHpJNfbjBXkgNrDJDeCW', '2025-03-13 12:30:02'),
(3, 'Ramatoulaye Gueye', 'rama.gueye@mail', '$2b$10$voqWttM5oeXiI2PqLJJa3uH/X.I/jcs7BGlqaOXqc8uXMW96OJ9gC', '2025-03-13 13:01:09'),
(4, 'usertest', 'exemple@gmail.com', '$2b$10$6PoTFOjNnvZ9/1VxpM4nyOKfE7bEaN8nAYT4w7p1wBqaUqokpumdy', '2025-03-16 00:58:19'),
(5, 'usertest2', 'yes@gmail.com', '$2b$10$ZbCxRVJoECV0SsBcsqzqpOFU4i1/zn2wRDnmdxUjwzQurCehfDgCm', '2025-03-16 01:03:31'),
(6, 'usertest3', 'yes1@gmail.com', '$2b$10$fgIlZnYNdFwCNel6/ppSxuHt28CeR.m1N.57LUxcFWkSmfbMjsjXS', '2025-03-16 01:10:29'),
(7, 'usertest4', 'yes2@gmail.com', '$2b$10$TwLBqr1AXMpLbS3/2XKHbe1JT6Oxo.fvl3ALpbUkOgChuhIkcZ1IG', '2025-03-16 01:18:16'),
(8, 'misterpi', 'misterpi@gmail.com', '$2b$10$u0Nv42cCai2Z/duDN4APUuPRtyPZjq0NJWsARqNCbb7MTWvRej3PS', '2025-03-17 13:55:32'),
(9, 'Abdou', 'exemple4@gmail.com', '$2b$10$lPMgRfwY3By9H3H4.PVUtu3QZ7meLRLP.QEFYcZkcG/wvCfy9shQC', '2025-03-18 06:11:30'),
(10, 'Abdoul', 'exemple5@gmail.com', '$2b$10$3Wm.uYxW0NcI75UkJgk8muXtpazRaBsOL4LacNFgIvTFVUi/UEKde', '2025-03-18 06:18:44'),
(11, 'Mai', 'mailodia7@gmail.com', '$2b$10$53PjSpQYeC5/yCkYnkVXZOhLOSXoYuhNX6JFWJp2KToHfxUJrEATS', '2025-04-10 13:52:26'),
(13, 'ibrahimatest2026', 'iboocbs@gmail.com', '$2b$10$WeFM1Yhut7uWiiQhkATSIOgb2Sj6/mbWka0CUZZQbsWfFxbNtN60C', '2026-04-27 12:49:54');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `followers`
--
ALTER TABLE `followers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `follower_id` (`follower_id`),
  ADD KEY `following_id` (`following_id`);

--
-- Index pour la table `follows`
--
ALTER TABLE `follows`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `follower_id` (`follower_id`,`followed_id`),
  ADD KEY `followed_id` (`followed_id`);

--
-- Index pour la table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_id` (`post_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `followers`
--
ALTER TABLE `followers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `follows`
--
ALTER TABLE `follows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`following_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `follows`
--
ALTER TABLE `follows`
  ADD CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`followed_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
