use myForum;

INSERT INTO `users` (`user_id`, `username`, `email`, `password_`, `signup_date`) VALUES ('1', 'Al', 'arosd001@gold.ac.uk', 'testpass', '2023-12-12');
INSERT INTO `users` (`user_id`, `username`, `email`, `password_`, `signup_date`) VALUES ('2', 'Bob', 'bob@gmail.com', 'testpassbob', '2023-12-11');
INSERT INTO `users` (`user_id`, `username`, `email`, `password_`, `signup_date`) VALUES ('3', 'Fakeman', 'fakeyfake@live.com', 'testpassfake', '2023-07-10');

INSERT INTO `topic` (`topic_id`, `topic_name`, `topic_desc`) VALUES ('1', 'Gaming', 'This topic is all about games and the discussion of them!');
INSERT INTO `topic` (`topic_id`, `topic_name`, `topic_desc`) VALUES ('2', 'Exercise', 'Come talk with others about your exercises habits and routines, advice and more.');
INSERT INTO `topic` (`topic_id`, `topic_name`, `topic_desc`) VALUES ('3', 'Cooking', 'Love to cook? Here we share everything cooking, whether you need help or want to share your cookie recipes, get involved :)');

insert into `subscriptions` (`user_id`, `topic_id`) VALUES (1, 1), (1, 2), (1, 3), (2, 1), (2, 2), (3, 1);

INSERT INTO `myforum`.`posts` (`post_id`, `topic_id`, `title`, `author_id`, `content`, `like_count`) VALUES ('1', '1', 'Dark Souls tips!', '1', 'If you can dodge a wrench, you can dodge a dragon!', '0');
INSERT INTO `myforum`.`posts` (`post_id`, `topic_id`, `title`, `author_id`, `content`, `like_count`) VALUES ('2', '1', 'League vs Dota 2', '3', 'Any thoughts? I feel like league has a more approachable aesthetic and wider reach, but dota 2 has more complexity and therefore higher skillcap for the sake of Esports.', '2');
INSERT INTO `myforum`.`posts` (`post_id`, `topic_id`, `title`, `author_id`, `content`, `like_count`) VALUES ('3', '1', 'Favourite pokemon game?', '2', 'Personally, mine would be Pokemon Crystal! What\'s yours?', '1');
