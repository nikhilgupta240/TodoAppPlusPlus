window.onload = getTodosAJAX();
const RESPONSE_DONE = 4;
const STATUS_OK = 200;
const NEW_TODO_INPUT_ID = "new_todo_input";
const ACTIVE_TODO_LIST_ID = "active_todo_list_div";
const COMPLETED_TODO_LIST_ID = "completed_todo_list_div";
const DELETED_TODO_LIST_ID = "deleted_todo_list_div";
const TODO_STATUS_ACTIVE = "ACTIVE";
const TODO_STATUS_COMPLETED = "COMPLETED";
const TODO_STATUS_DELETED = "DELETED";
//-----------------------------------------------------------------------------//
//----------------------------Utility functions--------------------------------//
//-----------------------------------------------------------------------------//

// Add all todo elements to the web app
function addTodoElements(todos_data_json) {
    var todos = JSON.parse(todos_data_json);
    var active_todo_parent = document.getElementById(ACTIVE_TODO_LIST_ID);
    var completed_todo_parent = document.getElementById(COMPLETED_TODO_LIST_ID);
    var deleted_todo_parent = document.getElementById(DELETED_TODO_LIST_ID);
    while(active_todo_parent.hasChildNodes()){
        active_todo_parent.removeChild(active_todo_parent.lastChild);
    }
    while(completed_todo_parent.hasChildNodes()){
        completed_todo_parent.removeChild(completed_todo_parent.lastChild);
    }
    for (todo_id in todos) {
        if (todos[todo_id].status === TODO_STATUS_ACTIVE) {
            active_todo_parent.appendChild(createActiveTodoElement(todo_id, todos[todo_id]));
        } else if (todos[todo_id].status === TODO_STATUS_COMPLETED) {
            completed_todo_parent.appendChild(createCompletedTodoElement(todo_id, todos[todo_id]));
        } else {
            // deleted_todo_parent.appendChild(createDeletedTodoElement(todo_id, todos[todo_id]));
        }
    }
}

function createActiveTodoElement(todo_id, todo) {
    var todo_element = document.createElement("div");
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("onchange", "setTodoCompletedAJAX(" + todo_id + ")");
    todo_element.appendChild(checkbox);
    var todo_title = document.createTextNode(todo.title);
    todo_element.appendChild(todo_title);
    return todo_element;
}

function createCompletedTodoElement(todo_id, todo) {
    var todo_element = document.createElement("div");
    todo_element.setAttribute("data-id", todo_id);
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("onchange", "setTodoActiveAJAX(" + todo_id + ")");
    todo_element.appendChild(checkbox);
    var todo_title = document.createTextNode(todo.title);
    todo_element.appendChild(todo_title);
    return todo_element;
}

function createDeletedTodoElement(todo_id, todo) {
    var todo_element = document.createElement("div");
    return todo_element;
}

//-----------------------------------------------------------------------------//
//------------------------------AJAX REQUEST'S---------------------------------//
//-----------------------------------------------------------------------------//

// Get all the todos
function getTodosAJAX() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/todos");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === RESPONSE_DONE) {
            if (xhr.status === STATUS_OK) {
                addTodoElements(xhr.responseText);
            }
        }
    };
    xhr.send(data = null);
}

// Add a new todo
function addTodoAJAX() {
    var todo_title = document.getElementById(NEW_TODO_INPUT_ID).value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/todos", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === RESPONSE_DONE) {
            if (xhr.status === STATUS_OK) {
                addTodoElements(xhr.responseText);
            } else {
                var resp = JSON.parse(xhr.responseText);
                alert(resp.error);
            }
        }
    };
    var data = "todo_title=" + encodeURI(todo_title);
    xhr.send(data);
}

function setTodoActiveAJAX(todo_id){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/" + todo_id);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function(){
        if(xhr.readyState === RESPONSE_DONE){
            if(xhr.status === STATUS_OK){
                addTodoElements(xhr.responseText);
            }
        }
    };
    var data = "todo_status="+encodeURI(TODO_STATUS_ACTIVE);

    xhr.send(data);
}

function setTodoCompletedAJAX(todo_id){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/" + todo_id);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function(){
        if(xhr.readyState === RESPONSE_DONE){
            if(xhr.status === STATUS_OK){
                addTodoElements(xhr.responseText);
            }
        }
    };
    var data = "todo_status="+encodeURI(TODO_STATUS_COMPLETED);

    xhr.send(data);
}

function setTodoDeletedAJAX(todo_id){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/" + todo_id);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function(){
        if(xhr.readyState === RESPONSE_DONE){
            if(xhr.status === STATUS_OK){
                addTodoElements(xhr.responseText);
            }
        }
    };
    var data = "todo_status="+encodeURI(TODO_STATUS_DELETED);

    xhr.send(data);
}