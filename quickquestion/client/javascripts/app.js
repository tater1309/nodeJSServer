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
			$(".addanswer").show();

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
	$(".addanswer").hide();
	
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
		});
		$("main .currentquestions").empty();
		$("main .currentquestions").append($display);
		
		//show "add answer" button if a user is logged in
		if ($("#hiddenUN").val() !== '') {
			$(".addanswer").show();
		}

		//show "show answers" button if there are answers available
		questionResponse.forEach(function (question) {
			if (question.answers.length > 0) {
				$("#btnshowanswer" + question.questionid).show();
			}
		});

	});
}

function buildQuestionDisplay(question) {
	//get time left
	var convertedtimeleft = timeLeft(question.expires);
	var answers = question.answers;
	var questionid = question.questionid;

	var $questiondiv = $("<div class='availablequestions'>");
	var $questionwrapper = $("<div class='questionwrapper'>");
	var $leftsidediv = $("<div class='leftside'>");
	var $rightsidediv = $("<div class='rightside'>");
	var $answerwrapper = $("<div class='answerwrapper' id='answerwrapper" + questionid + "'>");
	
	answers.forEach(function (answer) {
		$answerwrapper.append(buildAnswerDisplay(answer));
	});

	//build left side
	$leftsidediv.append($("<h2>").html(question.title));
	$leftsidediv.append($("<h3>").html(" Posted By: " + question.username));
	$leftsidediv.append($("<p>").html("<br />" + question.question));

	//build right side
	$rightsidediv.append($("<p class='expires'>").html("<br />Expires in: " + convertedtimeleft + "<br />Current Answers: " + answers.length));
	$rightsidediv.append($("<button class='showanswer' id='btnshowanswer" + questionid + "' onclick='showAnswers(" + questionid+ ")'>").text("Show Answers"));
	$rightsidediv.append($("<button class='hideanswer' id='btnhideanswer" + questionid + "' onclick='hideAnswers(" + questionid+ ")'>").text("Hide Answers"));
	$rightsidediv.append($("<button class='addanswer' onclick='showAnswerForm()'>").text("Add Answer"));

	//build question wrapper
	$questionwrapper.append($rightsidediv);
	$questionwrapper.append($leftsidediv);

	//build question div
	$questiondiv.append($questionwrapper);
	$questiondiv.append($answerwrapper);
	
	return $questiondiv;
}

function buildAnswerDisplay(answer) {
	var $answerdiv = $("<div class='answerdiv'>");

	//build answer
	$answerdiv.append($("<h3>").html("Posted By: " + answer.username));
	$answerdiv.append($("<p>").html("<br />" + answer.answer));
	
	return $answerdiv;
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

function showAnswerForm() {
	//make sure form fields are empty from previous use
	$("#xyz #popupform #question").val("");
	$("#xyz").show();
}

function showAnswers(questionid) {
	$("#btnshowanswer" + questionid).hide();
	$("#btnhideanswer" + questionid).show();
	$("#answerwrapper" + questionid).show();
}

function hideAnswers(questionid) {
	$("#btnhideanswer" + questionid).hide();
	$("#btnshowanswer" + questionid).show();
	$("#answerwrapper" + questionid).hide();
}

var main = function() {
	"use strict";
	$("#hiddenUN").val('')
	displayCurrentQuestions();

	/* Logon and Logoff */
	$("#btnLogon").click(function() {
		logon();
	});
	
	$("#btnLogoff").click(function() {
		logoff();
	});
	/*End Logon and Logoff */

	/* New Question Form */
	$("#btnNewPost").click(function() {
		//make sure form fields are empty from previous use
		$("#popupform #title").val("");
		$("#popupform #question").val("");
		$("#abc").show();
	});

	$("#abc #popupform #PostSubmit").click(function() {
		$("#abc").hide();
		newPost();
	});

	$("#abc #popupform #PostCancel").click(function() {
		$("#abc").hide();
	});
	/* End New Question Form */

	/* Add Answer Form */
	$("#xyz #popupform #PostSubmit").click(function() {
		$("#xyz").hide();
	});

	$("#xyz #popupform #PostCancel").click(function() {
		$("#xyz").hide();
	});
	/* End Add Answer Form */

	$("#btnRefresh").click(function() {
		displayCurrentQuestions();
	});
}
	
$(document).ready(main);