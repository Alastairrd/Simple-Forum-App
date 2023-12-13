CREATE DATABASE myForum;

use myForum;

CREATE table users (user_id INT NOT NULL auto_increment, username varchar(20), email VARCHAR(320), password_ VARCHAR(64), signup_date date, primary key (user_id));
CREATE table topics (topic_id INT NOT NULL auto_increment, topic_name VARCHAR(45) not null, topic_desc VARCHAR(400), primary key (topic_id));
CREATE table posts (post_id INT NOT NULL auto_increment, topic_id INT NOT NULL, title VARCHAR(360) not null, author_id int not null, content VARCHAR(10000), like_count int, primary key (post_id));
CREATE table replies (reply_id int not null auto_increment, previous_id int not null, content VARCHAR(1000) not null, likes int, replied_to boolean not null default 0, primary key (reply_id));
CREATE table subscriptions (user_id int not null, topic_id int not null);

ALTER TABLE `posts` 
ADD COLUMN `datetime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `like_count`;


CREATE USER 'forumuser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'ardforum2023';
GRANT ALL PRIVILEGES ON myForum.* TO 'forumuser'@'localhost';



