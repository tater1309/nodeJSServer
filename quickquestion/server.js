
var http = require("http"),
	express = require("express");

var users = [
	["timothy", "test"],
	["test", "test"]
];

var questionid = 0;
var allPosts = [];
buildTestQuestions();
buildTestAnswers(0);

//new post object constructor
function newPost(username, title, question, expires, questionid) {
	this.questionid = questionid;
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
function getExpireTime(limit) {
	var expiretime, time;

	time = new Date();
	time = time.getTime();

	expiretime = time + parseInt(limit);

	return expiretime;
}

//add questions to db for testing
function buildTestQuestions() {
	var post1 = new newPost("server", "Test Question 1", "Does this fill the array?", getExpireTime(86400000), questionid);
	questionid++;
	var post2 = new newPost("server", "Test Question 2", "Does this fill the array?", getExpireTime(86400000), questionid);
	questionid++;

	allPosts.push(post1);
	allPosts.push(post2);
}

function buildTestAnswers(questionid) {
	var answer1 = new newAnswer("other", "Yes it does.");
	var answer2 = new newAnswer("other", "No it doesn't.");
	allPosts[questionid].answers.push(answer1);
	allPosts[questionid].answers.push(answer2);
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
	post = new newPost(postinfo.username, postinfo.title, postinfo.question, getExpireTime(postinfo.expire), questionid);
	questionid++;
	allPosts.push(post);

	res.json({"posted":true});
});

app.post("/newAnswer", function (req, res) {
	var answer, postinfo;

	postinfo = req.body;
	answer = new newAnswer(postinfo.username, postinfo.answer);
	allPosts[postinfo.questionid].answers.push(answer);
	
	res.json({"posted":true});
});

console.log("Server is listening at http://localhost:3000/");