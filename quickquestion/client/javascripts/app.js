"use strict";

var main = function() {
	$("#btnLogon").click(function() {
		logon();
	});

	/*
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
*/
}

function logon() {
	var username, password, userinfo;

	username = $("#username").val();
	password = $("#password").val();

	userinfo = {"username":username, "password":password};

	$.post("userlogin", userinfo, function(response) {
		console.log(response.logon);

		if (response.logon) {
			var $newwelcome = $("<p>").html("Welcome " + username + "<br>");

			$newwelcome.append($("<button>").attr('id', "btnNewPost").text("New Post"));
			$("header .welcome").empty();
			$("header .welcome").append($newwelcome);
		}
	})

	$("#username").val("");
	$("#password").val("");

	//$("main .currentquestions").html("<p>Inside logon</p>");
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