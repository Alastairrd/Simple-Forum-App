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
		let newData = Object.assign({}, forumData, {
			topics: topTopics,
			user: req.session.user,
		});

		//render page with new data
		res.render("index.ejs", newData);
	});

	//return all posts
	app.get("/list", async function (req, res) {
		const posts = await new Promise((resolve, reject) => {
			db.query(
				`SELECT * from post_topics ORDER BY datetime DESC`,
				(error, results) => {
					if (error) {
						reject(error);
					} else {
						resolve(results);
					}
				}
			);
		});

		//return all users
		const users = await new Promise((resolve, reject) => {
			db.query(
				`SELECT * from users ORDER BY user_id ASC`,
				(error, results) => {
					if (error) {
						reject(error);
					} else {
						resolve(results);
					}
				}
			);
		});

		//return all topics
		const topics = await new Promise((resolve, reject) => {
			db.query(
				`SELECT * from TOPICS ORDER BY topic_id ASC`,
				(error, results) => {
					if (error) {
						reject(error);
					} else {
						resolve(results);
					}
				}
			);
		});

		//changing the post dates to format better
		for (i = 0; i < posts.length; i++) {
			d = new Date();
			d = posts[i].datetime;
			posts[i].datetime = d.toLocaleString();
		}

		//changing the user dates to format better
		for (i = 0; i < users.length; i++) {
			d = new Date();
			d = users[i].signup_date;
			users[i].signup_date = d.toLocaleDateString();
		}

		//make object with all list data
		let newData = Object.assign({}, forumData, {
			topics: topics,
			users: users,
			posts: posts,
			user: req.session.user,
		});

		res.render("list.ejs", newData);
	});

	//return all posts
	app.get("/about", async function (req, res) {
		const posts = await new Promise((resolve, reject) => {
			db.query(
				`SELECT username, topic_name, post_id, title from post_topics ORDER BY datetime DESC`,
				(error, results) => {
					if (error) {
						reject(error);
					} else {
						resolve(results);
					}
				}
			);
		});

		//return all users
		const users = await new Promise((resolve, reject) => {
			db.query(
				`SELECT username from users ORDER BY username ASC`,
				(error, results) => {
					if (error) {
						reject(error);
					} else {
						resolve(results);
					}
				}
			);
		});

		//return all topics
		const topics = await new Promise((resolve, reject) => {
			db.query(
				`SELECT topic_name, topic_id from TOPICS ORDER BY topic_id ASC`,
				(error, results) => {
					if (error) {
						reject(error);
					} else {
						resolve(results);
					}
				}
			);
		});

		//make object with all list data
		let newData = Object.assign({}, forumData, {
			topics: topics,
			users: users,
			posts: posts,
			user: req.session.user,
		});

		console.log(newData)
		res.render("about.ejs", newData);
	});

	app.get("/user", async function (req, res) {
		//user page information
		let username = req.query.username;

		// sql to get user info
		userResults = await new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM users WHERE username = ?`,
				username,
				(error, results) => {
					if (error) {
						reject(error);
					} else {
						resolve(results);
					}
				}
			);
		});

		//signup date formatting
		d = new Date();
		d = userResults[0].signup_date;
		userResults[0].signup_date = d.toLocaleDateString();

		//sql to get subscribed topics
		userTopics = await new Promise((resolve, reject) => {
			db.query(
				`SELECT subscriptions.topic_id, topics.topic_name FROM subscriptions JOIN topics ON subscriptions.topic_id = topics.topic_id WHERE subscriptions.user_id = ?`,
				userResults[0].user_id,
				(error, results) => {
					if (error) {
						reject(error);
					} else {
						resolve(results);
					}
				}
			);
		});

		//sql to get user posts
		userPosts = await new Promise((resolve, reject) => {
			db.query(
				`SELECT * from post_topics WHERE author_id = ?`,
				userResults[0].user_id,
				(error, results) => {
					if (error) {
						reject(error);
					} else {
						resolve(results);
					}
				}
			);
		});

		//create new data object, add to forum data and pass in render function
		let newData = Object.assign({}, forumData, {
			userData: userResults[0],
			topics: userTopics,
			posts: userPosts,
			user: req.session.user,
			user_id: req.session.user_id,
		});

		res.render("user.ejs", newData);
	});

	app.get("/search", async function (req, res) {
		//logic for searching
		let postData = null;

		console.log(req.query.keyword);

		//if we have a keyword, look for search results
		if (req.query.keyword != undefined) {
			postData = await new Promise((resolve, reject) => {
				db.query(
					`SELECT * from post_topics WHERE title LIKE '%` +
						req.query.keyword +
						`%' ORDER BY datetime DESC`,
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results);
							console.log(results)
						}
					}
				);
			});
		}

		console.log(postData)

		//check we have results
		if (postData != null) {
			//changing the posts dates to format better
			for (i = 0; i < postData.length; i++) {
				d = new Date();
				d = postData[i].datetime;
				postData[i].datetime = d.toLocaleString();
			}
		}

		let newData = Object.assign({}, forumData, {
			posts: postData,
			user: req.session.user,
		});

		console.log(newData)

		res.render("search.ejs", newData);
	});

	app.get("/topic", async function (req, res) {
		//topic name url from sql query
		let inputTopicID = req.query.id;
		let isUserSubscribed = false;

		if (req.session.user != undefined) {
			//sql query to get all topics user is subscribed to
			userTopics = await new Promise((resolve, reject) => {
				db.query(
					`SELECT topic_id from subscriptions WHERE user_id = ? && topic_id = ?`,
					[req.session.user_id, req.query.id],
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results);
						}
					}
				);
			});

			//if user_id and topic_id match in subscriptions, return true, otherwise false
			if (userTopics.length == 0) {
				isUserSubscribed = false;
			} else {
				isUserSubscribed = true;
			}
		}

		//call procedure to check post_topics views for relevant posts from passed in topic name
		const results = await new Promise((resolve, reject) => {
			db.query(`CALL getPosts(?)`, inputTopicID, (error, results) => {
				if (error) {
					reject(error);
				} else {
					resolve(results);
				}
			});
		});

		//changing the post date to format better
		for (i = 0; i < results[0].length; i++) {
			//changing the post date to format better
			d = new Date();
			d = results[0][i].datetime;
			results[0][i].datetime = d.toLocaleString();
		}

		//get topic related info
		const topicData = await new Promise((resolve, reject) => {
			db.query(
				`CALL selectTopicByID(?)`,
				inputTopicID,
				(error, result) => {
					if (error) {
						reject(error);
					} else {
						resolve(result[0]);
					}
				}
			);
		});

		//get count of users joined to topic
		const subCount = await new Promise((resolve, reject) => {
			db.query(
				`SELECT COUNT(topic_id) as count FROM subscriptions WHERE topic_id = ?`,
				inputTopicID,
				(error, result) => {
					if (error) {
						reject(error);
					} else {
						resolve(result[0]);
					}
				}
			);
		});

		//create new data object, add to forum data and pass in render function
		let newData = Object.assign({}, forumData, {
			posts: results[0],
			topic: topicData[0],
			user: req.session.user,
			user_id: req.session.user_id,
			isSubscribed: isUserSubscribed,
			url: req.originalUrl,
			subs: subCount.count
		});

		//render topic page with topic data
		res.render("topic.ejs", newData);
	});

	app.get("/post", async function (req, res) {
		//url has to be topic/post url combo from sql query
		let inputPostID = req.query.id;
		let isUserSubscribed = false;

		//check if we have active user
		if (req.session.user != undefined) {
			//sql query to get topic id
			topicID = await new Promise((resolve, reject) => {
				db.query(
					`SELECT topic_id from topics WHERE topic_name = ?`,
					req.query.topic,
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results);
						}
					}
				);
			});

			//get all topics user is a member of
			userTopics = await new Promise((resolve, reject) => {
				db.query(
					`SELECT topic_id from subscriptions WHERE user_id = ? && topic_id = ?`,
					[req.session.user_id, topicID[0].topic_id],
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results);
						}
					}
				);
			});

			//if user_id and topic_id match in subscriptions, return true, otherwise false
			if (userTopics.length == 0) {
				isUserSubscribed = false;
			} else {
				isUserSubscribed = true;
			}
		}

		//call procedure to check post_topics views for relevant post from passed in post id
		const results = await new Promise((resolve, reject) => {
			db.query(`CALL getPostData(?)`, inputPostID, (error, results) => {
				if (error) {
					reject(error);
				} else {
					resolve(results);
				}
			});
		});

		//selects all comments in ascending date time order
		const comResults = await new Promise((resolve, reject) => {
			db.query(`CALL getComments(?)`, inputPostID, (error, results) => {
				if (error) {
					reject(error);
				} else {
					resolve(results);
				}
			});
		});

		//changing the post date to format better
		d = new Date();
		d = results[0][0].datetime;
		results[0][0].datetime = d.toLocaleString();

		//changing the comment dates to format better
		for (i = 0; i < comResults[0].length; i++) {
			d = new Date();
			d = comResults[0][i].datetime;
			comResults[0][i].datetime = d.toLocaleString();

			//if comment is a reply to another comment
			if (comResults[0][i].previous_id != null) {

				//loop through comments
				for (j = 0; j < comResults.length; j++) {

					//if comment is a match to the id of the comment being replied to
					if (
						comResults[0][j].reply_id ==
						comResults[0][i].previous_id
					) {
						//added fields on for username and content of comment being replied to
						comResults[0][i].quote_Username =
							comResults[0][j].username;
						comResults[0][i].quote_Content =
							comResults[0][j].content;
					}
				}
			}
		}

		//this object now has post, topic name, and all comments for post
		let newData = Object.assign({}, forumData, {
			post: results[0],
			comments: comResults[0],
			postID: req.query.id,
			postTitle: results[0][0].title,
			topicName: results[0][0].topic_name.replace(/\s/g, "-"),
			user: req.session.user,
			user_id: req.session.user_id,
			isSubscribed: isUserSubscribed,
			url: req.originalUrl,
		});

		//render page with post date
		res.render("post.ejs", newData);
	});

	app.get("/login", function (req, res) {

		//sets some base variables and passes user in for page rendering
		let newData = Object.assign({}, forumData, {
			loginFailed: false,
			user: req.session.user,
		});

		res.render("login.ejs", newData);
	});

	app.post("/login", async function (req, res) {
	
		//variable set up for login validation
		const inputUser = req.body.user;
		const inputPass = req.body.pass;

		let params = [inputUser, inputPass];
		let sqlquery = `CALL validateUser(?,?)`;

		//check if username and password match a user
		const results = await new Promise((resolve, reject) => {
			db.query(sqlquery, params, (error, results) => {
				if (error) {
					reject(error);
				} else {
					resolve(results);
				}
			});
		});

		//if no user found for that combo
		if (results[0].length == 0) {
			//redirect back to login page, display error message saying there is no matching user
			let newData = Object.assign({}, forumData, {
				loginFailed: true,
				user: req.session.user,
			});

			res.render("login.ejs", newData);
		} else {
			// regenerate the session, which is good practice to help
			// guard against forms of session fixation
			req.session.regenerate(function (err) {
				if (err) next(err);

				// store user information in session, typically a user id
				req.session.user = req.body.user;
				req.session.user_id = results[0][0].user_id;

				// save the session before redirection to ensure page
				// load does not happen before session is saved
				req.session.save(function (err) {
					if (err) return next(err);
					res.redirect("/");
				});
			});
		}
	});

	app.get("/logout", function (req, res, next) {
		// logout logic

		// clear the user from the session object and save.
		// this will ensure that re-using the old session id
		// does not have a logged in user
		req.session.user = null;
		req.session.save(function (err) {
			if (err) next(err);

			// regenerate the session, which is good practice to help
			// guard against forms of session fixation
			req.session.regenerate(function (err) {
				if (err) next(err);
				res.redirect("/");
			});
		});
	});

	app.post("/subscribe", async function (req, res, next) {
		// subscribe logic
		//check if match in subscription list already
		//if not, add it
		let isUserSubscribed = false;

		if (req.session.user != undefined) {
			//sql query to get all topics user is subscribed to
			userTopics = await new Promise((resolve, reject) => {
				db.query(
					`SELECT topic_id from subscriptions WHERE user_id = ? && topic_id = ?`,
					[req.body.user_id, req.body.topic_id],
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results);
						}
					}
				);
			});

			//if user_id and topic_id match in subscriptions, return true, otherwise false
			if (userTopics.length == 0) {
				isUserSubscribed = false;
			} else {
				isUserSubscribed = true;
			}
		}

		if (isUserSubscribed != true) {
			//insert user and topic into subscriptions
			await new Promise((resolve, reject) => {
				db.query(
					`INSERT INTO subscriptions (user_id, topic_id) VALUES (?, ?)`,
					[req.body.user_id, req.body.topic_id],
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results);
						}
					}
				);
			});
		}

		//redirect back to original url
		res.redirect(req.protocol + "://" + req.get("host") + req.body.url);
	});

	app.post("/addpost", async function (req, res, next) {
		//posting logic
		let isUserSubscribed = false;

		//check we have active login just in case
		if (req.session.user != undefined) {
			//sql query to get all topics user is subscribed to
			userTopics = await new Promise((resolve, reject) => {
				db.query(
					`SELECT topic_id from subscriptions WHERE user_id = ? && topic_id = ?`,
					[req.body.user_id, req.body.topic_id],
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results);
						}
					}
				);
			});

			//if user_id and topic_id match in subscriptions, return true, otherwise false
			if (userTopics.length == 0) {
				isUserSubscribed = false;
			} else {
				isUserSubscribed = true;
			}
		}

		//check user is subscribed again, just in case
		if (isUserSubscribed == true) {
			//insert post into db
			await new Promise((resolve, reject) => {
				db.query(
					`INSERT INTO posts (topic_id, title, author_id, content) VALUES (?, ?, ?, ?)`,
					[
						req.body.topic_id,
						req.body.title,
						req.body.user_id,
						req.body.content,
					],
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results);
						}
					}
				);
			});
		}

		//redirect back to original url
		res.redirect(req.protocol + "://" + req.get("host") + req.body.url);
	});

	app.post("/addComment", async function (req, res) {
		//posting comment logic
		let isUserSubscribed = false;

		//check we have active login just in case
		if (req.session.user != undefined) {
			//sql query to get all topics user is subscribed to
			userTopics = await new Promise((resolve, reject) => {
				db.query(
					`SELECT topic_id from subscriptions WHERE user_id = ? && topic_id = ?`,
					[req.body.user_id, req.body.topic_id],
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results);
						}
					}
				);
			});

			//if user_id and topic_id match in subscriptions, return true, otherwise false
			if (userTopics.length == 0) {
				isUserSubscribed = false;
			} else {
				isUserSubscribed = true;
			}
		}

		console.log(req.body.previous_id);

		//check user is subscribed again, just in case
		if (isUserSubscribed == true && req.body.previous_id != "") {
			//insert reply into db
			await new Promise((resolve, reject) => {
				db.query(
					`INSERT INTO replies (previous_id, content, post_id, user_id) VALUES (?, ?, ?, ?)`,
					[
						req.body.previous_id,
						req.body.content,
						req.body.post_id,
						req.body.user_id,
					],
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results);
						}
					}
				);
			});
		} else if (isUserSubscribed == true && req.body.previous_id == "") {
			//insert reply into db
			await new Promise((resolve, reject) => {
				db.query(
					`INSERT INTO replies (content, post_id, user_id) VALUES (?, ?, ?)`,
					[req.body.content, req.body.post_id, req.body.user_id],
					(error, results) => {
						if (error) {
							reject(error);
						} else {
							resolve(results);
						}
					}
				);
			});
		}

		//redirect back to original url
		res.redirect(req.protocol + "://" + req.get("host") + req.body.url);
	});
};
