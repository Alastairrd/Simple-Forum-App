DELIMITER //
// CREATE DEFINER=`root`@`localhost` PROCEDURE `getPostData`(IN postID INT)
BEGIN
	SELECT * FROM post_topics
    WHERE postID = post_id;
END //



// CREATE DEFINER=`root`@`localhost` PROCEDURE `getPosts`(IN input_id INT)
BEGIN
	SELECT * FROM post_topics
    WHERE topic_id = input_id;
END //



// CREATE DEFINER=`root`@`localhost` PROCEDURE `selectTopicByID`(IN input_id INT)
BEGIN

SELECT * from topics where topic_id = input_id;
	
END //



// CREATE DEFINER=`root`@`localhost` PROCEDURE `topTopics`()
BEGIN
Select topic_id, COUNT(topic_id) FROM subscriptions GROUP BY topic_id ORDER BY COUNT(topic_id) DESC;
END
//