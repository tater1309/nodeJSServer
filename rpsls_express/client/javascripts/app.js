var main = function() {
	"use strict";
	$("#btnRock").click(function() {
		processResults("/play/rock");
	});

	$("#btnScissors").click(function() {
		processResults("/play/scissors");
	});

	$("#btnPaper").click(function() {
		processResults("/play/paper");
	});

	$("#btnLizard").click(function() {
		processResults("/play/lizard");
	});

	$("#btnSpock").click(function() {
		processResults("/play/spock");
	});
};

function buildResults(response) {

	var $resultString= $("<p>").html("Game Result: " + response.outcome + "<br><br>Total Wins: " + response.wins +
		"<br>Total losses: " + response.losses + "<br>Total ties: " + response.ties);

	return $resultString;
}

function processResults(stringPath) {
	var $result;

	$.getJSON(stringPath, function(response) {
		$("main .gameResults").empty();
		$result = buildResults(response);
		$("main .gameResults").append($result);
	});
}
	
$(document).ready(main);