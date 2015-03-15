var http = require("http"),
	express = require("express"),
	server, app, userChoice, serverChoice, result,
	score = {};

//matrix holding possible outcomes
var winMatrix = [
	[0,2,1,2,1],
	[1,0,2,1,2],
	[2,1,0,2,1],
	[1,2,1,0,2],
	[2,1,2,1,0]
];

//initialize json object
score.outcome = "";
score.wins = 0;
score.losses = 0;
score.ties = 0;

function playGame(userChoice) {
	serverChoice = randomNum(0,4);

	console.log("User Choice: " + userChoice);
	console.log("Server Choice: " + serverChoice);

	result = winMatrix[userChoice][serverChoice];

	if (result === 0) {
		score.outcome = "Tie";
		score.ties = score.ties + 1;
	}
	else if (result === 1) {
		score.outcome = "Win";
		score.wins = score.wins + 1;
	}
	else {
		score.outcome = "Loss";
		score.losses = score.losses + 1;
	}
}

function randomNum (low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
}

app = express();
http.createServer(app).listen(3000);

app.use(express.static(__dirname + "/client"));

app.get("/play/rock", function (req,res) {
	playGame(0);
	res.json(score);
});

app.get("/play/paper", function (req,res) {
	playGame(1);
	res.json(score);
});

app.get("/play/scissors", function (req,res) {
	playGame(2);
	res.json(score);
});

app.get("/play/lizard", function (req,res) {
	playGame(3);
	res.json(score);
});

app.get("/play/spock", function (req,res) {
	playGame(4);
	res.json(score);
});


console.log("Server is listening at http://localhost:3000/");