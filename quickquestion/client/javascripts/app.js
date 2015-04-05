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
			var $newwelcome = $("<h3>").html("Welcome " + username + "<br>");

			$(".logoff #logonWelcome").empty();
			$(".logoff #logonWelcome").append($newwelcome);
		}
	});

	$("#username").val("");
	$("#password").val("");
}

function logoff() {
	$("#hiddenUN").val("");
	$(".logon").show();
	$(".logoff").hide();
	
	$("#btnNewPost").hide();
	$(".addanswer").hide();
}

function displayCurrentQuestions() {
	var $display = $("<p>");
	$.getJSON("/displayQuestions", function (questionResponse){
		var curtime = new Date();
		curtime = curtime.getTime();

		questionResponse.forEach(function (question) {
			if (question.expires > curtime) {
				$display.append(buildQuestionDisplay(question));
			}
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
	$leftsidediv.append($("<input />").attr({
		type: "hidden", 
		id: "questionid", 
		value: question.questionid 
	}));
	$leftsidediv.append($("<h2>").html(question.title));
	$leftsidediv.append($("<h3>").html(" Posted By: " + question.username));
	$leftsidediv.append($("<p>").html("<br />" + question.question));

	//build right side
	$rightsidediv.append($("<p class='expires'>").html("<br />Expires in:<br /> " + convertedtimeleft + "<br />Current Answers: " + answers.length));
	$rightsidediv.append($("<button class='showanswer' id='btnshowanswer" + questionid + "' onclick='showAnswers(" + questionid+ ")'>").text("Show Answers"));
	$rightsidediv.append($("<button class='hideanswer' id='btnhideanswer" + questionid + "' onclick='hideAnswers(" + questionid+ ")'>").text("Hide Answers"));
	$rightsidediv.append($("<button class='addanswer' id='btnaddanswer" + questionid + "'onclick='showAnswerForm(" + questionid+ ")'>").text("Add Answer"));

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

function newRegistration() {
	var username, pw1, pw2, email, reginfo;

	username = $("#popupform #regusername").val();
	pw1 = $("#popupform #reg1stpassword").val();
	pw2 = $("#popupform #reg2ndpassword").val();
	email = $("#popupform #regemail").val();

	if (username === "") {
		alert("Username cannot be empty");
	} else if (pw1 === "" || pw2 === "") {
		alert("Password cannot be empty");
	} else if (email === "") {
		alert("Email cannot be empty");
	} else if (pw1 !== pw2) {
		alert("Passwords must match");
	} else {
		reginfo = {"username":username, "password":pw1, "email": email};
		$.post("/registration", reginfo, function(response) {
			if (response.registration) {
				alert("Registration Complete, Please log in to continue");
				$("#sss").hide();
			}
			else {
				alert("Username already in use");
			}
		});

	}
}

function newPost() {
	var username, title, question, expire, postinfo;

	$("#btnNewPost").show();
	username = $("#hiddenUN").val();
	title = $("#popupform #title").val();
	question = $("#popupform #question").val();
	expire = $("#popupform input[type=radio]:checked").val();
	postinfo = {"username":username, "title":title, "question":question, "expire": expire};


	if (postinfo.title === "") {
		alert("Title cannot be empty");
	} else if (postinfo.question === "") {
		alert("Question cannot be empty");
	} else {
		$.post("/newPost", postinfo, function(response) {
			if (response.posted) {
				displayCurrentQuestions();
				alert("Post successful");
				$("#abc").hide();
			}
			else {
				alert("Unable to post question");
			}
		});
	}
}

function newAnswer() {
	var username, questionid, answer, postinfo;
	username = $("#hiddenUN").val();
	questionid = $("#hiddenqid").val();
	answer = $("#popupform #answer").val();
	postinfo = {"username": username, "questionid": questionid, "answer": answer};

	if (postinfo.answer === "") {
		alert("Answer cannot be empty");
	} else {
		$.post("/newAnswer", postinfo, function(response) {
			if (response.posted) {
				displayCurrentQuestions();
				alert("Post successful");
				$("#xyz").hide();
			}
			else {
				alert("Unable to add answer");
			}
		});
	}
}

function timeLeft(futuretime) {
	var curtime, timeleft, mydate, humandate;
	curtime = new Date();
	curtime = curtime.getTime();
	timeleft = futuretime - curtime;
	mydate = new Date(timeleft);
	humandate = mydate.getUTCHours() + " hours, " + 
				mydate.getUTCMinutes() + " minutes, " +
				mydate.getUTCSeconds() + " seconds";
	return humandate;
}

function showAnswerForm(questionid) {
	//make sure form fields are empty from previous use
	$("#xyz #popupform #answer").val("");
	$("#xyz #popupform #hiddenqid").val(questionid);
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
	$("#hiddenUN").val("");
	displayCurrentQuestions();

	/* Logon and Logoff */
	$("#btnLogon").click(function() {
		logon();
	});
	
	$("#btnLogoff").click(function() {
		logoff();
	});
	/*End Logon and Logoff */

	/* Registration Form */
	$("#btnRegister").click(function() {
		//make sure form fields are empty from previous use
		$("#popupform #regusername").val("");
		$("#popupform #reg1stpassword").val("");
		$("#popupform #reg2ndpassword").val("");
		$("#popupform #regemail").val("");
		$("#sss").show();
	});

	$("#sss #popupform #PostSubmit").click(function() {
		newRegistration();
	});

	$("#sss #popupform #PostCancel").click(function() {
		$("#sss").hide();
	});
	/* End Registration Form */

	/* New Question Form */
	$("#btnNewPost").click(function() {
		//make sure form fields are empty from previous use
		$("#popupform #title").val("");
		$("#popupform #question").val("");
		$("#abc").show();
	});

	$("#abc #popupform #PostSubmit").click(function() {
		newPost();
	});

	$("#abc #popupform #PostCancel").click(function() {
		$("#abc").hide();
	});
	/* End New Question Form */

	/* Add Answer Form */
	$("#xyz #popupform #PostSubmit").click(function() {
		newAnswer();
	});

	$("#xyz #popupform #PostCancel").click(function() {
		$("#xyz").hide();
	});
	/* End Add Answer Form */

	$("#btnRefresh").click(function() {
		displayCurrentQuestions();
	});
};
	
$(document).ready(main);