var express = require("express");
const port = 4000;              // server port number

var app = express();

app.use("/", function(req, res, next){
    console.log(req.method + " " + req.url);
    next();
});

app.use("/", express.static(__dirname + "/public"));

app.listen(port, console.log("Listening on localhost:" + port));