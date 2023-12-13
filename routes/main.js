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

		//render page with new data
		console.log(newData.topics[0][0].topic_name);
		res.render("index.ejs", newData);

		// db.query(sqlquery, true, (error, results) => {
		// 	if (error) {
		// 		return console.error(error.message);
		// 	}
		// 	for (i = 0; i < 3; i++) {
		// 		x = results[0][i].topic_id;
		// 		topTopics[i] = x;
		// 	}
		//}

		//     // seperate queries for each of the top three topics
		//     //i have done this as when I used a for loop, the queries executed asynchronously
		//     //and the index of the loop was not being used as it should

		//     //topic 1
		//     db.query(
		//         `CALL selectTopicByID(?)`,
		//         topTopics[0],
		//         (error, selectResults) => {
		//             if (error) {
		//                 res.redirect("./");
		//             }

		//             topTopics[0] = Object.assign({}, selectResults[0]);

		//         }
		//     );

		//     //topic 2
		//     db.query(
		//         `CALL selectTopicByID(?)`,
		//         topTopics[1],
		//         (error, selectResults) => {
		//             if (error) {
		//                 res.redirect("./");
		//             }

		//             topTopics[1] = Object.assign({}, selectResults[0]);

		//         }
		//     );

		//     //topic 3
		//     db.query(
		//         `CALL selectTopicByID(?)`,
		//         topTopics[2],
		//         (error, selectResults) => {
		//             if (error) {
		//                 res.redirect("./");
		//             }

		//             topTopics[2] = Object.assign({}, selectResults[0]);

		//         }
		//     );

		// 	let newData = Object.assign({}, forumData, { topics: topTopics });
		// 	console.log(newData);

		//     console.log(newData.topics[0].topic_name);

		// 	res.render("index.ejs", newData);
		// });
	});

	//TODO design list page
	app.get("/list", function (req, res) {
		res.render("list.ejs", forumData);
	});

	//TODO design topic page template
	app.get("/topic", function (req, res) {
		//topic name url from sql query

		//render topic page with topic data
		res.render("topic.ejs", forumData);
	});

	//TODO design topic page template
	app.get("/topic-post", function (req, res) {
		//url has to be topic/post url combo from sql query
		//render page with post date
		res.render("topic.ejs", forumData);
	});
};
