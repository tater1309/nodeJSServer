var http = require("http"),
	express = require("express");

var users = [
	["timothy", "test"],
	["test", "test"]
];

//new post object constructor
function newPost(user, title, question, timestamp) {
	this.user = user;
	this.title = title;
	this.question = question;
	this.timestamp = timestamp;
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

console.log("Server is listening at http://localhost:3000/");