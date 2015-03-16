"use strict";

var main = function() {
	displayCurrentQuestions();

	$("#btnLogon").click(function() {
		logon();
	});

	$("#btnNewPost").click(function() {
		$("#popupform").show();
		$("#btnNewPost").hide();
	});

	$("#btnSubmitPost").click(function() {
		newPost();
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

			$("#hiddenUN").val(username);
			var $newwelcome = $("<p>").html("Welcome " + username + "<br>");

			$("header .welcome").empty();
			$("header .welcome").append($newwelcome);
		}
	});

	$("#username").val("");
	$("#password").val("");
}

function displayCurrentQuestions() {
	var $display = $("<p>");
	$.getJSON("/displayQuestions", function (questionResponse){

		questionResponse.forEach(function (question) {
			$display.append($("<div>"));
			$display.append($("<h2>").html(question.title));
			$display.append($("<h3>").html(" Posted By: " + question.username));
			$display.append($("<p>").html("<br />" + question.question));
			$display.append($("<button>").text("Answer"));
			$display.append($("<br>"));
			$display.append($("<hr>"));
		})
		$("main .currentquestions").empty();
		$("main .currentquestions").append($display);
	})
}

function newPost() {
	var username, title, question, postinfo;

	$("#popupform").hide();
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
	
$(document).ready(main);