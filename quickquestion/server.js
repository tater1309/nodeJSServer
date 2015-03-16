var http = require("http"),
	express = require("express");

var users = [
	["timothy", "test"],
	["test", "test"]
];

var allPosts = [];
var post1 = new newPost("server", "Test Question 1", "Does this fill the array?", getTimeStamp());
var post2 = new newPost("server", "Test Question 2", "Does this fill the array?", getTimeStamp());

allPosts.push(post1);
allPosts.push(post2);

//new post object constructor
function newPost(username, title, question, timestamp) {
	this.username = username;
	this.title = title;
	this.question = question;
	this.timestamp = timestamp;
}

//get timestamp
function getTimeStamp() {
	Date.now = function now() {
		return new Date().getTime();
	}
}

app = express();
http.createServer(app).listen(3000);

app.use(express.static(__dirname + "/client"));
app.use(express.urlencoded());
//app.use(express.cookieParser());
//app.use(express.session({secret: '1234567890QWERTY'}));

app.post("/userlogin", function (req,res) {
	
	var valid = false;
	var userinfo = req.body;
		for (var i=0; i < users.length; i++) {
			if ((users[i][0] === userinfo.username) && (users[i][1] === userinfo.password)) {
				valid = true;
			}
		}
	if (valid === true) {
		res.json({"logon":true});
	}
	else {
		res.json({"logon":false});
	}
});

app.get("/displayQuestions", function (req, res) {
	res.json(allPosts);
});

app.post("/newPost", function (req, res) {
	console.log("inside new post");
	var post, postinfo;

	postinfo = req.body;
	post = new newPost(postinfo.username, postinfo.title, postinfo.question, getTimeStamp());
	allPosts.push(post);

	res.json({"posted":true});
});

console.log("Server is listening at http://localhost:3000/");