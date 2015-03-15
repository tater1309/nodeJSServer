function buildResults(response) {
	var $outcome, $wins, $losses, $ties, $resultString;

	$outcome = response.outcome;
	$wins = response.wins;
	$losses = response.losses;
	$ties = response.ties;

	$resultString= $("<p>").text("Game Result: " + $outcome);
	$resultString.append($("<p>").text("Total wins: " + $wins));
	$resultString.append($("<p>").text("Total losses: " + $losses));
	$resultString.append($("<p>").text("Total ties: " + $ties));

	return $resultString;
}

function processResults(stringPath) {
	$("main .gameResults").empty();

	$.getJSON(stringPath, function(jsonresult) {
		$result = buildResults(jsonresult);
	});

	$("main .gameResults").append($result);
}

var main = function() {
	"use strict";

	//variables
	var $result;

	$("#btnRock").click(function() {
		processResults("/play/rock");
		//$("main .gameResults").empty();

		//$.getJSON("/play/rock", function(jsonresult) {
		//$result = buildResults(jsonresult);
		//});

		//$("main .gameResults").append($result);
	});

	$("#btnScissors").click(function() {
		processResults("/play/scissors");
		//$("main .gameResults").empty();

		//$.getJSON("/play/scissors", function(jsonresult) {
		//$result = buildResults(jsonresult);
		//});

		//$("main .gameResults").append($result);
	});

	$("#btnPaper").click(function() {
		processResults("/play/paper");
		//$("main .gameResults").empty();

		//$.getJSON("/play/paper", function(jsonresult) {
		//$result = buildResults(jsonresult);
		//});

		//$("main .gameResults").append($result);
	});

	$("#btnLizard").click(function() {
		processResults("/play/lizard");
		//$("main .gameResults").empty();

		//$.getJSON("/play/lizard", function(jsonresult) {
		//$result = buildResults(jsonresult);
		//});

		//$("main .gameResults").append($result);
	});

	$("#btnSpock").click(function() {
		processResults("/play/spock");
		//$("main .gameResults").empty();

		//$.getJSON("/play/spock", function(jsonresult) {
		//$result = buildResults(jsonresult);
		//});

		//$("main .gameResults").append($result);
	});
}
	
$(document).ready(main);