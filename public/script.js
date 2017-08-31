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

function createActiveTodoElement(todo_id, todo) {
    var todo_element = document.createElement("div");
    todo_element.setAttribute("data-id", todo_id);
    todo_element.appendChild(createCheckbox(todo_id, todo));
    todo_element.appendChild(createTitleElement(todo));
    todo_element.appendChild(createDeleteX(todo_id));
    return todo_element;
}

function createCompletedTodoElement(todo_id, todo) {
    var todo_element = document.createElement("div");
    todo_element.setAttribute("data-id", todo_id);
    todo_element.appendChild(createCheckbox(todo_id, todo));
    todo_element.appendChild(createTitleElement(todo));
    todo_element.appendChild(createDeleteX(todo_id));
    return todo_element;
}

function createDeletedTodoElement(todo_id, todo) {
    var todo_element = document.createElement("div");
    todo_element.setAttribute("data-id", todo_id);
    todo_element.appendChild(createTitleElement(todo));
    return todo_element;
}

function createCheckbox(todo_id, todo) {
    var checkbox_div = document.createElement("div");
    checkbox_div.setAttribute("class", "col-xs-2");
    checkbox_div.setAttribute("align", "right");
    var checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("onchange", "setTodoCompletedAJAX(" + todo_id + ")");
    if (todo.status === TODO_STATUS_COMPLETED) {
        checkbox.checked = true;
        checkbox.setAttribute("onchange", "setTodoActiveAJAX(" + todo_id + ")");
    }
    checkbox_div.appendChild(checkbox);
    return checkbox_div;
}

function createTitleElement(todo) {
    var todo_text = document.createElement("div");
    todo_text.setAttribute("class", "col-xs-8 todoStatus" + todo.status);
    todo_text.innerText = todo.title;
    return todo_text;
}

function createDeleteX(todo_id) {
    var delete_x_div = document.createElement("div");
    delete_x_div.setAttribute("class", "text-danger col-xs-2");
    var delete_x = document.createElement("button");
    delete_x.setAttribute("class", "btn btn-link");
    delete_x.innerText = "X";
    delete_x.setAttribute("onclick", "setTodoDeletedAJAX(" + todo_id + ")");
    delete_x_div.appendChild(delete_x);
    return delete_x_div;
}

function hideCompletedItems() {
    var complete_parent = document.getElementById(COMPLETED_TODO_LIST_ID);
    if (complete_parent.style.display === 'none') {
        complete_parent.style.display = 'block';
    } else {
        complete_parent.style.display = 'none';
    }
}

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

// Get all the todos
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

// Add a new todo
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