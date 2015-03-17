var main = function() {
	"use strict";
	$("#hiddenUN").val('')
	displayCurrentQuestions();

	$("#btnLogon").click(function() {
		logon();
	});
	
	$("#btnLogoff").click(function() {
		logoff();
	});

	$("#btnNewPost").click(function() {
		//make sure form fields are empty from previous use
		$("#popupform #title").val("");
		$("#popupform #question").val("");
		$("#abc").show();
	});

	$("#popupform #submit").click(function() {
		$("#abc").hide();
		newPost();
	});

	$("#popupform #cancel").click(function() {
		$("#abc").hide();
	});

	$("#btnRefresh").click(function() {
		displayCurrentQuestions();
	});
}

function logon() {
	var username, password, userinfo;

	username = $("#username").val();
	password = $("#password").val();

	userinfo = {"username":username, "password":password};

	$.post("userlogin", userinfo, function(response) {

		if (response.logon) {
			$(".logon").hide();
			
			$(".logoff").show();
			$("#btnNewPost").show();
			$(".answerbutton").show();

			$("#hiddenUN").val(username);
			var $newwelcome = $("<p>").html("Welcome " + username + "<br>");

			$("header .welcome").empty();
			$("header .welcome").append($newwelcome);
		}
	});

	$("#username").val("");
	$("#password").val("");
}

function logoff() {
	$("#hiddenUN").val('')
	$(".logon").show();
	$(".logoff").hide();
	
	$("#btnNewPost").hide();
	$(".answerbutton").hide();
	
	var $newwelcome = $("<p>").html("Welcome Guest<br>");

	$("header .welcome").empty();
	$("header .welcome").append($newwelcome);
}

function displayCurrentQuestions() {
	var curtime, futuretime, timeleft, convertedtimeleft;
	var $display = $("<p>");
	$.getJSON("/displayQuestions", function (questionResponse){

		questionResponse.forEach(function (question) {
			$display.append(buildQuestionDisplay(question));
		})
		$("main .currentquestions").empty();
		$("main .currentquestions").append($display);
		
		//show answer button if a user is logged in
		if ($("#hiddenUN").val() !== '') {
			$(".answerbutton").show();
		}
	})
}

function buildQuestionDisplay(question) {
	var convertedtimeleft = timeLeft(question.expires);
	var $questiondiv = $("<div class='availablequestions'>");
	var $leftsidediv = $("<div class='leftside'>");
	var $rightsidediv = $("<div class='rightside'>");

	//build left side
	$leftsidediv.append($("<h2>").html(question.title));
	$leftsidediv.append($("<h3>").html(" Posted By: " + question.username));
	$leftsidediv.append($("<p>").html("<br />" + question.question));

	//build right side
	$rightsidediv.append($("<p class='expires'>").html("<br />Expires in: " + convertedtimeleft + "<br />Answers: 0<br />"));
	$rightsidediv.append($("<button class='answerbutton'>").text("Add Answer"));

	//build question div
	$questiondiv.append($rightsidediv);
	$questiondiv.append($leftsidediv);
	$questiondiv.append($("<br />"));
	
	return $questiondiv;
}

function newPost() {
	var username, title, question, postinfo;

	$("#btnNewPost").show();
	username = $("#hiddenUN").val();
	title = $("#popupform #title").val();
	question = $("#popupform #question").val();
	postinfo = {"username":username, "title":title, "question":question};

	$.post("/newPost", postinfo, function(response) {
		if (response.posted) {
			displayCurrentQuestions();
		}
	});
}

function timeLeft(futuretime) {
	var curtime, timeleft, mydate, humandate;
	curtime = new Date();
	curtime = curtime.getTime();
	timeleft = futuretime - curtime;
	mydate = new Date(timeleft);
	humandate = mydate.getUTCHours() + " hours, " + mydate.getUTCMinutes() + " minutes";
	return humandate;
}
	
$(document).ready(main);