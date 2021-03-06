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

// Enables all tooltips
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});

// Add all todo elements to the web app
function addTodoElements(todos_data_json) {
    var todos = JSON.parse(todos_data_json);
    var active_todo_parent = document.getElementById(ACTIVE_TODO_LIST_ID);
    var completed_todo_parent = document.getElementById(COMPLETED_TODO_LIST_ID);
    var deleted_todo_parent = document.getElementById(DELETED_TODO_LIST_ID);

    // Remove previous entries so that they do not duplicate on refresh
    while (active_todo_parent.hasChildNodes()) {
        active_todo_parent.removeChild(active_todo_parent.lastChild);
    }
    while (completed_todo_parent.hasChildNodes()) {
        completed_todo_parent.removeChild(completed_todo_parent.lastChild);
    }

    while (deleted_todo_parent.hasChildNodes()) {
        deleted_todo_parent.removeChild(deleted_todo_parent.lastChild);
    }

    for (todo_id in todos) {
        if (todos[todo_id].status === TODO_STATUS_ACTIVE) {
            active_todo_parent.appendChild(createActiveTodoElement(todo_id, todos[todo_id]));
        } else if (todos[todo_id].status === TODO_STATUS_COMPLETED) {
            completed_todo_parent.appendChild(createCompletedTodoElement(todo_id, todos[todo_id]));
        } else {
            deleted_todo_parent.appendChild(createDeletedTodoElement(todo_id, todos[todo_id]));
        }
    }
}

// Creates a div having a checkbox, todo title and delete button as its children and return the div
// to be appended to active_parent
function createActiveTodoElement(todo_id, todo) {
    var todo_element = document.createElement("div");
    todo_element.setAttribute("data-id", todo_id);
    todo_element.setAttribute("class", "row");
    todo_element.appendChild(createCheckbox(todo_id, todo));
    todo_element.appendChild(createTitleElement(todo));
    todo_element.appendChild(createDeleteX(todo_id));
    return todo_element;
}

// Creates a div having a checkbox, todo title and delete button as its children and return the div
// to be appended to completed_parent
function createCompletedTodoElement(todo_id, todo) {
    var todo_element = document.createElement("div");
    todo_element.setAttribute("data-id", todo_id);
    todo_element.setAttribute("class", "row");
    todo_element.appendChild(createCheckbox(todo_id, todo));
    todo_element.appendChild(createTitleElement(todo));
    todo_element.appendChild(createDeleteX(todo_id));
    return todo_element;
}

// Creates a div having a todo title as its children and return the div
// to be appended to deleted_parent
function createDeletedTodoElement(todo_id, todo) {
    var todo_element = document.createElement("div");
    todo_element.setAttribute("data-id", todo_id);
    todo_element.appendChild(createTitleElement(todo));
    return todo_element;
}

// Creates a checkbox for acitve and completed todos. If todo is completed checkbox is checked.
function createCheckbox(todo_id, todo) {
    var checkbox_div = document.createElement("div");
    checkbox_div.setAttribute("class", "col-xs-2");
    checkbox_div.setAttribute("align", "right");
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("class", "css-checkbox");
    checkbox.setAttribute("id", "checkbox" + todo_id);
    checkbox.setAttribute("onchange", "setTodoCompletedAJAX(" + todo_id + ")");
    if (todo.status === TODO_STATUS_COMPLETED) {
        checkbox.checked = true;
        checkbox.setAttribute("onchange", "setTodoActiveAJAX(" + todo_id + ")");
    }
    checkbox_div.appendChild(checkbox);
    var label = document.createElement("label");
    label.setAttribute("for", "checkbox"+todo_id);
    label.setAttribute("class", "css-label");
    checkbox_div.appendChild(label);
    return checkbox_div;
}

// creates an element with todo title and returns the element
function createTitleElement(todo) {
    var todo_text = document.createElement("div");
    todo_text.setAttribute("class", "col-xs-8 todoStatus" + todo.status);
    todo_text.innerText = todo.title;
    return todo_text;
}

// creates an element with delete button
function createDeleteX(todo_id) {
    var delete_x_div = document.createElement("div");
    delete_x_div.setAttribute("class", "text-danger col-xs-2");
    var delete_x = document.createElement("button");
    delete_x.setAttribute("class", "btn btn-link");
    delete_x.innerHTML = "<sup>X</sup>";
    delete_x.setAttribute("onclick", "setTodoDeletedAJAX(" + todo_id + ")");
    delete_x.setAttribute("data-toggle", "tooltip");
    delete_x.setAttribute("title", "Delete todo");
    delete_x_div.appendChild(delete_x);
    return delete_x_div;
}

// function to hide the list of completed todos from display
// It toggle's the display of the completed_parent element
function hideCompletedItems() {
    var complete_parent = document.getElementById(COMPLETED_TODO_LIST_ID);
    if (complete_parent.style.display === 'none') {
        complete_parent.style.display = 'block';
    } else {
        complete_parent.style.display = 'none';
    }
}

// function to hide the list of deleted todos from display
// It toggle's the display of the deleted_parent element
function hideDeletedItems() {
    var parent = document.getElementById(DELETED_TODO_LIST_ID);
    if (parent.style.display === 'none') {
        parent.style.display = 'block';
    } else {
        parent.style.display = 'none';
    }
}

//-----------------------------------------------------------------------------//
//------------------------------AJAX REQUEST'S---------------------------------//
//-----------------------------------------------------------------------------//

// Get all the todos from the server with GET request on /api/todos
function getTodosAJAX() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/api/todos");
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
    xhr.send(data = null);
}

// It adds a new todo to the database with POST request on api/todos and
// todo_title conaining the title of the new todo
function addTodoAJAX() {
    var todo_input = document.getElementById(NEW_TODO_INPUT_ID);
    var todo_title = todo_input.value;
    todo_input.value = "";
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

// Set's the status of the todo with id = todo_id to be active using PUT request
function setTodoActiveAJAX(todo_id) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/" + todo_id);
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
    var data = "todo_status=" + encodeURI(TODO_STATUS_ACTIVE);

    xhr.send(data);
}

// Set's the status of the todo with id = todo_id to be completed using PUT request
function setTodoCompletedAJAX(todo_id) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/" + todo_id);
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
    var data = "todo_status=" + encodeURI(TODO_STATUS_COMPLETED);

    xhr.send(data);
}

// Set's the status of the todo with id = todo_id to be deleted using PUT request
function setTodoDeletedAJAX(todo_id) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/" + todo_id);
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
    var data = "todo_status=" + encodeURI(TODO_STATUS_DELETED);

    xhr.send(data);
}