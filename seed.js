var statusENUMS = {
    ACTIVE: "ACTIVE",
    COMPLETE: "COMPLETED",
    DELETED: "DELETED"
};

var todos = {
    1: {title: "An Active todo", status: statusENUMS.ACTIVE},
    2: {title: "A completed todo", status: statusENUMS.COMPLETE},
    3: {title: "Deleted todo", status: statusENUMS.DELETED}
};

var next_todo_id = 4;

module.exports = {
    statusENUMS: statusENUMS,
    todos: todos,
    next_todo_id: next_todo_id
};