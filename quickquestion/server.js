
var http = require("http"),
	express = require("express");

var users = [
	["timothy", "test"],
	["test", "test"]
];

var allPosts = [];
buildTestQuestions();


//new post object constructor
function newPost(username, title, question, expires) {
	this.username = username;
	this.title = title;
	this.question = question;
	this.expires = expires;
	this.answers = [];
}

//new answer object constructor
function newAnswer(username, answer) {
	this.username = username;
	this.answer = answer;
}

//get timestamp
function getExpireTime() {
	var expiretime, time;

	time = new Date();
	time = time.getTime();

	//expires in 24 hours
	expiretime = time + 86400000;
	//console.log("Added to server: " + time);
	return expiretime;
}

//add questions to db for testing
function buildTestQuestions() {
	var post1 = new newPost("server", "Test Question 1", "Does this fill the array?", getExpireTime());
	var post2 = new newPost("server", "Test Question 2", "Does this fill the array?", getExpireTime());

	allPosts.push(post1);
	allPosts.push(post2);
}

app = express();
http.createServer(app).listen(3000);

app.use(express.static(__dirname + "/client"));
app.use(express.urlencoded());

//routing
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
	var post, postinfo;

	postinfo = req.body;
	post = new newPost(postinfo.username, postinfo.title, postinfo.question, getExpireTime());
	allPosts.push(post);

	res.json({"posted":true});
});

console.log("Server is listening at http://localhost:3000/");