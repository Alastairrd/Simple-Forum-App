module.exports = function (app, forumData) {
	//set to async function so we can use await
	app.get("/", async function (req, res) {
		//setup our first sql query
		const sqlquery = `CALL topTopics`;
		const topTopics = [];

		//query to find the most subscribed to topics

		//use await and promise to make sure database queries resolve before we continue with code
		const results = await new Promise((resolve, reject) => {
			db.query(sqlquery, true, (error, results) => {
				if (error) {
					reject(error);
				} else {
					resolve(results);
				}
			});
		});

		//populate top topics array with the id's from the first query
		for (let i = 0; i < 3; i++) {
			topTopics[i] = results[0][i].topic_id;
		}

		//iterate through top topics array and create a new dbquery with a promise for each topic
		//change the top topics value at that index into the returned row of data from database
		for (let i = 0; i < topTopics.length; i++) {
			const topicId = topTopics[i];
			const result = await new Promise((resolve, reject) => {
				db.query(
					`CALL selectTopicByID(?)`,
					topicId,
					(error, result) => {
						if (error) {
							reject(error);
						} else {
							resolve(result[0]);
						}
					}
				);
			});

			topTopics[i] = result;
		}

		//assign this new databse data to the forumData object being passed to page
		let newData = Object.assign({}, forumData, { topics: topTopics });

		console.log(newData)

		//render page with new data
		res.render("index.ejs", newData);
	});

	//TODO design list page
	app.get("/list", function (req, res) {
		res.render("list.ejs", forumData);
	});

	//TODO design topic page template
	app.get("/topic", async function (req, res) {
		//topic name url from sql query
		let inputTopicID = req.query.id;

		//call procedure to check post_topics views for relevant posts from passed in topic name
		const results = await new Promise((resolve, reject) => {
			db.query(`CALL getPosts(?)`, inputTopicID, (error, results) => {
				if(error){
					reject(error)
				} else {
					resolve(results)
				}
			}) 
		});

		let newData = Object.assign({}, forumData, { posts: results[0], topic_id: req.query.id, topicName: req.query.name})

		console.log(newData);

		//create new data object, add to forum data and pass in render function

		//render topic page with topic data
		res.render("topic.ejs", newData);
	});

	//TODO design topic page template
	app.get("/post", async function (req, res) {
		//url has to be topic/post url combo from sql query
		let inputPostID = req.query.id;

		//call procedure to check post_topics views for relevant posts from passed in topic name
		const results = await new Promise((resolve, reject) => {
			db.query(`CALL getPostData(?)`, inputPostID, (error, results) => {
				if(error){
					reject(error)
				} else {
					resolve(results)
				}
			}) 
		});

		let newData = Object.assign({}, forumData, { post: results[0], postID: req.query.id, postTitle: req.query.title })



		//render page with post date
		res.render("post.ejs", newData);
	});
};
