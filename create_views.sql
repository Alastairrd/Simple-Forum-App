CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `myforum`.`post_topics` AS
    SELECT 
        `myforum`.`posts`.`post_id` AS `post_id`,
        `myforum`.`posts`.`title` AS `title`,
        `myforum`.`posts`.`author_id` AS `author_id`,
        `myforum`.`posts`.`content` AS `content`,
        `myforum`.`posts`.`like_count` AS `like_count`,
        `myforum`.`posts`.`datetime` AS `datetime`,
        `myforum`.`topics`.`topic_name` AS `topic_name`,
        `myforum`.`topics`.`topic_desc` AS `topic_desc`,
        `myforum`.`topics`.`topic_id` AS `topic_id`
    FROM
        (`myforum`.`posts`
        JOIN `myforum`.`topics` ON ((`myforum`.`posts`.`topic_id` = `myforum`.`topics`.`topic_id`)))
    ORDER BY `myforum`.`posts`.`datetime` DESC