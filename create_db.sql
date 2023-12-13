CREATE DATABASE myForum;

use myForum;

CREATE table users (user_id INT NOT NULL auto_increment, username varchar(20), email VARCHAR(320), password_ VARCHAR(64), signup_date date, primary key (user_id));
CREATE table topic (topic_id INT NOT NULL auto_increment, topic_name VARCHAR(45) not null, topic_desc VARCHAR(400), primary key (topic_id));
CREATE table posts (post_id INT NOT NULL auto_increment, topic_id INT NOT NULL, title VARCHAR(360) not null, author_id int not null, content VARCHAR(10000), like_count int, primary key (post_id));
CREATE table replies (reply_id int not null auto_increment, previous_id int not null, content VARCHAR(1000) not null, likes int, replied_to boolean not null default 0, primary key (reply_id));
CREATE table subscriptions (user_id int not null, topic_id int not null);

ALTER TABLE `myforum`.`posts` 
ADD COLUMN `datetime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `like_count`;


CREATE USER 'forumuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'ardforum2023';
GRANT ALL PRIVILEGES ON myForum.* TO 'forumuser'@'localhost';

DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `getPostData`(IN postID INT)
BEGIN
	SELECT * FROM post_topics
    WHERE postID = post_id;
END
DELIMITER ;

DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `getPosts`(IN input_id INT)
BEGIN
	SELECT * FROM post_topics
    WHERE topic_id = input_id;
END
DELIMITER ;

DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `selectTopicByID`(IN input_id INT)
BEGIN

SELECT * from topics where topic_id = input_id;
	
END
DELIMITER ;

DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `topTopics`()
BEGIN
Select topic_id, COUNT(topic_id) FROM subscriptions GROUP BY topic_id ORDER BY COUNT(topic_id) DESC;
END
DELIMITER ;

