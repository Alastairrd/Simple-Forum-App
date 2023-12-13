CREATE OR REPLACE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `post_topics` AS
    SELECT 
        `posts`.`post_id` AS `post_id`,
        `posts`.`title` AS `title`,
        `posts`.`author_id` AS `author_id`,
        `posts`.`content` AS `content`,
        `posts`.`like_count` AS `like_count`,
        `posts`.`datetime` AS `datetime`,
        `topics`.`topic_name` AS `topic_name`,
        `topics`.`topic_desc` AS `topic_desc`,
        `topics`.`topic_id` AS `topic_id`,
        `users`.`username` AS `username`
    FROM
        (`posts`
        JOIN `topics` ON ((`posts`.`topic_id` = `topics`.`topic_id`))
        JOIN `users` ON ((`posts`.`author_id` = `users`.`user_id`)))
    ORDER BY `posts`.`datetime` DESC;


