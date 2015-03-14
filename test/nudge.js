#!/usr/bin/env node

//assistance for pulling in CSS found at http://stackoverflow.com/questions/15798816/how-do-i-handle-css-with-node-js

"use strict";

var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs"),
    querystring = require("querystring"),
    child_process = require("child_process");

function writeCSS(res, pathName) {
    res.writeHead(200, {
        "Content-Type": "text/css"
    });
	fs.readFile('./' + pathName, 'utf8', function(err, fd) {
                res.end(fd);
            });
	console.log('Routed for Cascading Style Sheet '+ pathName +' Successfully\n');
}

function writeJS(res, pathName) {
    res.writeHead(200, {
        "Content-Type": "text/javascript"
    });
	fs.readFile('./' + pathName, 'utf8', function(err, fd) {
                res.end(fd);
            });
	console.log('Routed for JavaScript '+ pathName +' Successfully\n');
}

function beginPage(res, title) {
    res.write("<!DOCTYPE html>\n");
    res.write("<html lang='en'>\n");
    res.write("<head>\n");
    res.write("<meta charset='utf-8'>\n");
    res.write("<title>"+ title + "</title>\n");
    res.write("<link rel='stylesheet' href='/style.css' type='text/css'>\n");
    res.write("</head>\n");
    res.write("<body>\n");
	res.write("<div class='jumbotron'>\n");
	res.write("<div class='container'>\n");
}

function endPage(res) {
	res.write("<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->\n");
	res.write("<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js'></script>\n");
	res.write("<!-- Include all compiled plugins (below), or include individual files as needed -->\n");
	res.write("<script src='js/bootstrap.min.js'></script>\n");
	res.write("</div>\n");
	res.write("</div>\n");
    res.write("</body>\n");
    res.write("</html>\n");
    res.end();
}

function writeHeading(res, tag, title) {
    res.write("<" + tag + ">" + title + "</" + tag + ">\n");
}

function writePre(res, divClass, data) {
    var escaped = data.replace(/</, "&lt;").
                       replace(/>/, "&gt;");

    res.write("<div class='" + divClass + "_div'>\n");
    res.write("<pre>");
    res.write(escaped);
    res.write("</pre>\n");
    res.write("</div>\n");
}

function beginForm(res) {
    res.write("<form method='POST' action='/push'>\n");
}

function endForm(res) {
    res.write("<input type='submit' value='Push'>\n");
    res.write("</form>\n");
}

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function beginSelect(res, what) {
    res.write("<div class='" + what + "_div'>\n");
    res.write("<label for='" + what + "_select'>" + capitalize(what) + "</label>\n");
    res.write("<select id='" + what + "_select' name='" + what + "'>\n");
}

function writeOption(res, option) {
    res.write("<option value='" + option + "'>" + option + "</option>\n");
}

function endSelect(res) {
    res.write("</select>\n");
    res.write("</div>\n");
}

function gitRemote(res) {
    child_process.exec("git remote", function(err, stdout, stderr) {
        if (err) {
            writeHeading(res, "h2", "Error listing remotes");
            writePre(res, "error", stderr);
            endPage(res);
        } else {
            var output = stdout.toString(),
                remotes = output.split(/\n/);

            beginSelect(res, "remote");

            remotes.forEach(function(remoteName) {
                if (remoteName) {
                    writeOption(res, remoteName);
                }
            });

            endSelect(res);
            endForm(res);
            endPage(res);
        }
    });
}

function gitBranch(res) {
    child_process.exec("git branch", function(err, stdout, stderr) {
        if (err) {
            writeHeading(res, "h2", "Error listing branches");
            writePre(res, "error", stderr);
            endPage(res);
        } else {
            var output = stdout.toString(),
                branches = output.split(/\n/);

            beginForm(res);
            beginSelect(res, "branch");

            branches.forEach(function(branch) {
                var branchName = branch.replace(/^\s*\*?\s*/, "").
                                        replace(/\s*$/, "");

                if (branchName) {
                    writeOption(res, branchName);
                }
            });

            endSelect(res);
            gitRemote(res);
        }
    });
}

function gitStatus(res) {
    child_process.exec("git status", function(err, stdout, stderr) {
        if (err) {
            writeHeading(res, "h2", "Error retrieving status");
            writePre(res, "error", stderr);
            endPage(res);
        } else {
            writeHeading(res, "h2", "Git Status");
            writePre(res, "status", stdout);
            gitBranch(res);
        }
    });
}

function gitPush(req, res) {
    var body = "";

    req.on("data", function(chunk) {
        body += chunk;
    });

    req.on("end", function () {
        var form = querystring.parse(body);

        child_process.exec("git push " + form.remote + " " + form.branch, function(err, stdout, stderr) {
            if (err) {
                writeHeading(res, "h2", "Error pushing repository");
                writePre(res, "error", stderr);
            } else {
                writeHeading(res, "h2", "Git Push");
                writePre(res, "push", stdout);
            }
            gitStatus(res);
        });
    });
}

function frontPage(req, res) {
    res.writeHead(200, {
        "Content-Type": "text/html"
    });
	
	var pathName = url.parse(req.url).pathname;
	var ext = path.extname(pathName);
	
	console.log('Request for ' + pathName + ' recieved.');

	if (ext === ".css") {
        writeCSS(res, pathName);
    } 
	else if (ext === ".js") {
		writeJS(res, pathName);
	}
	else {
        var title = "Nudge - Web Interface for Git Push";

        beginPage(res, title);
        writeHeading(res, "h1", title);
		
        if (req.method === "POST" && req.url === "/push") {
            gitPush(req, res);
        } else {
            gitStatus(res);
        }
    }
}

var server = http.createServer(frontPage);
server.listen(3000);
console.log("Server listening on port 3000");
//var address = server.address();
//console.log("nudge is listening at http://localhost:" + address.port + "/");
