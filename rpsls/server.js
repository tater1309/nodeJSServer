var http = require("http"),
	server, userChoice, serverChoice, result,
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


function playGame (req, res) {
	
	res.writeHead(200, {
		"Content-Type": "application/json"
	});
	if (req.method==="POST") {
		//get the server's choice
		serverChoice = randomNum(0,4);

		if (req.url === "/play/rock") {
			userChoice = 0;
		}
		if (req.url === "/play/paper") {
			userChoice = 1;
		}
		if (req.url === "/play/scissors") {
			userChoice = 2;
		}
		if (req.url === "/play/lizard") {
			userChoice = 3;
		}
		if (req.url === "/play/spock") {
			userChoice = 4;
		}

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

		//send JSON
		res.end(JSON.stringify(score));
	}
}

function randomNum (low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
}

server = http.createServer(playGame);
server.listen(3000);

console.log("Server is listening at http://localhost:3000/");