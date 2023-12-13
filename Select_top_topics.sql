
Select topic_id, COUNT(topic_id) FROM subscriptions GROUP BY topic_id ORDER BY COUNT(topic_id) DESC;