var http = require("http"),
    express = require("express");

//simulated databases
var users = [];
var allPosts = [];

//variables
var questionid = 0;

//build testing data
buildTestUsers();
buildTestQuestions();
buildTestAnswers(0);

/* Constructors */
//new registration constructor
function newUser(username, password) {
	this.username = username;
	this.password = password;
}


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
/* End constructors */


/* Testing functions */
//add users to db for testing
function buildTestUsers() {
	var user1 = new newUser("test", "test");
	var user2 = new newUser("timothy", "test");

	users.push(user1);
	users.push(user2);
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

//add answers to test question for testing
function buildTestAnswers(questionid) {
	var answer1 = new newAnswer("other", "Yes it does.");
	var answer2 = new newAnswer("other", "No it doesn't.");
	allPosts[questionid].answers.push(answer1);
	allPosts[questionid].answers.push(answer2);
}
/* End testing functions */


//get timestamp
function getExpireTime(limit) {
	var expiretime, time;

	time = new Date();
	time = time.getTime();

	expiretime = time + parseInt(limit);

	return expiretime;
}

//run server
app = express();
http.createServer(app).listen(3000);

//allow for folder access
app.use(express.static(__dirname + "/client"));
app.use(express.urlencoded());

//routing
app.post("/registration", function (req,res) {
	
	var valid = true;
	var reginfo = req.body;
	var registration;

	for (var i=0; i < users.length; i++) {
		if (users[i].username === reginfo.username) {
			valid = false;
		}
	}
	if (valid === true) {
		registration = new newUser(reginfo.username, reginfo.password);
		users.push(registration);
		res.json({"registration":true});
	}
	else {
		res.json({"registration":false});
	}
});

app.post("/userlogin", function (req,res) {
	
	var valid = false;
	var userinfo = req.body;
	for (var i=0; i < users.length; i++) {
		if ((users[i].username === userinfo.username) && (users[i].password === userinfo.password)) {
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
