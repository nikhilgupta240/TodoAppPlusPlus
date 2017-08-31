// Node Modules to be used for development
var express = require("express");
var bodyParser = require("body-parser");
var todo_db = require("./seed");
const port = 4000;              // server port number

var app = express();

// Log all the requests on the server
app.use("/", function (req, res, next) {
    console.log(req.method + " " + req.url);
    next();
});

app.use("/", express.static(__dirname + "/public"));

// parses the post data and makes it available under req.body
app.use("/", bodyParser.urlencoded({extended: false}));

//-----------------------------------------------------------------------------//
//------------------------------- RESTFull API'S-------------------------------//
//-----------------------------------------------------------------------------//

//--------------------------------- GET API'S ---------------------------------//

// GET all todos
app.get("/api/todos", function (req, res) {
    res.json(todo_db.todos);
});

//-------------------------------- POST API'S ---------------------------------//

// add a new todo, with the title of new todo to be in the key "todo_title"
app.post("/api/todos", function (req, res) {
    var todo_title = req.body.todo_title;
    if (!todo_title || todo_title === "" || todo_title.trim() === "") {
        res.status(400).json({error: "Todo title can't be empty"});
    }
    else {
        todo_db.todos[todo_db.next_todo_id++] = {
            title: todo_title,
            status: todo_db.statusENUMS.ACTIVE
        };
        res.json(todo_db.todos);
    }
});


//--------------------------------- PUT API'S ---------------------------------//

// update a todo, with new todo title in key "todo_title" and status in key "todo_status"
app.put("/api/todos/:id", function (req, res) {
    var id = req.params.id;
    var todo = todo_db.todos[id];
    if (!todo) {
        res.status(400);
        res.json({error: "Todo doesn't exist"});
    }
    else {
        var todo_title = req.body.todo_title;

        if (todo_title && todo_title !== "" && todo_title.trim() !== "") {
            todo.title = todo_title;
        }

        var todo_status = req.body.todo_status;

        if (todo_status &&
            (todo_status === todo_db.statusENUMS.ACTIVE ||
                todo_status === todo_db.statusENUMS.COMPLETE ||
                todo_status === todo_db.statusENUMS.DELETED)
        ) {
            todo.status = todo_status;
        }

        res.json(todo_db.todos);
    }
});

//------------------------------- DELETE API'S --------------------------------//

// delete a todo
app.delete("/api/todos/:id", function (req, res) {
    var id = req.params.id;
    var todo = todo_db.todos[id];
    if (!todo) {
        res.status(400);
        res.json({error: "Todo doesn't exist"});
    }
    else {
        todo.status = todo_db.statusENUMS.DELETED;
        res.json(todo_db.todos);
    }
});

//-----------------------------------------------------------------------------//
//--------------------------- END OF RESTFull API'S----------------------------//
//-----------------------------------------------------------------------------//

app.listen(port, console.log("Listening on localhost:" + port));