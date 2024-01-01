CREATE DATABASE  IF NOT EXISTS `myForum` ;
USE `myForum`;

CREATE TABLE `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `topic_id` int NOT NULL,
  `title` varchar(360) NOT NULL,
  `author_id` int NOT NULL,
  `content` varchar(10000) DEFAULT NULL,
  `like_count` int NOT NULL DEFAULT '0',
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB;

CREATE TABLE `replies` (
  `reply_id` int NOT NULL AUTO_INCREMENT,
  `previous_id` int DEFAULT NULL,
  `content` varchar(1000) NOT NULL,
  `likes` int NOT NULL DEFAULT '0',
  `replied_to` tinyint(1) NOT NULL DEFAULT '0',
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`reply_id`)
) ENGINE=InnoDB;

CREATE TABLE `topics` (
  `topic_id` int NOT NULL AUTO_INCREMENT,
  `topic_name` varchar(45) NOT NULL,
  `topic_desc` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`topic_id`)
) ENGINE=InnoDB;

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `email` varchar(320) DEFAULT NULL,
  `pass` varchar(64) DEFAULT NULL,
  `signup_date` date DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB;

CREATE TABLE `subscriptions` (
  `user_id` int NOT NULL,
  `topic_id` int NOT NULL
) ENGINE=InnoDB;

DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getComments`(IN postID int)
BEGIN
    SELECT replies.*, users.username
    from replies
    JOIN users
    ON replies.user_id = users.user_id
    WHERE postID = replies.post_id
    
    ORDER by datetime ASC;
END ;;

;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getPostData`(IN postID INT)
BEGIN
	SELECT * FROM post_topics
    WHERE postID = post_id;
END ;;

;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getPosts`(IN input_id INT)
BEGIN
	SELECT * FROM post_topics
    WHERE topic_id = input_id;
END ;;

;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `selectTopicByID`(IN input_id INT)
BEGIN

SELECT * from topics where topic_id = input_id;
	
END ;;

;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `topTopics`()
BEGIN
Select topic_id, COUNT(topic_id) FROM subscriptions GROUP BY topic_id ORDER BY COUNT(topic_id) DESC;
END ;;

;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `validateUser`(IN inputUser VARCHAR(20), IN inputPass VARCHAR(64))
BEGIN
SELECT * from users
WHERE inputUser = username && inputPass = pass;
END ;;

