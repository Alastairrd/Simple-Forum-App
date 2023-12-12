module.exports = function (app, appData) {

    //TODO design home page
    app.get("/", function (req, res) {
		res.render("index.ejs", appData);
	});

    //TODO design list page
    app.get("/list", function (req, res) {
		res.render("list.ejs", appData);
	});

    //TODO design topic page template
    app.get("/topic", function (req, res) {
        //topic name url from sql query

        //render topic page with topic data
		res.render("topic.ejs", appData);
	});

    //TODO design topic page template
    app.get("/topic-post", function (req, res) {

        //url has to be topic/post url combo from sql query
        //render page with post date
		res.render("topic.ejs", appData);
	});

}