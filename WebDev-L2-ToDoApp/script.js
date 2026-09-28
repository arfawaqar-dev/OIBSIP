/* =========================================
   TASKFLOW TO-DO APP
   OIB-SIP LEVEL 2 - TASK 3
========================================= */


// =========================================
// VARIABLES
// =========================================

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const errorMessage = document.getElementById("errorMessage");

const pendingTasksContainer =
    document.getElementById("pendingTasks");

const completedTasksContainer =
    document.getElementById("completedTasks");

const pendingCount =
    document.getElementById("pendingCount");

const completedCount =
    document.getElementById("completedCount");

const pendingBadge =
    document.getElementById("pendingBadge");

const completedBadge =
    document.getElementById("completedBadge");

const currentDate =
    document.getElementById("currentDate");


// =========================================
// TASK DATA
// =========================================

let tasks = JSON.parse(
    localStorage.getItem("taskflowTasks")
) || [];


// =========================================
// CURRENT DATE
// =========================================

function displayCurrentDate() {

    const today = new Date();

    currentDate.textContent =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );
}


displayCurrentDate();


// =========================================
// SAVE TASKS
// =========================================

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );
}


// =========================================
// ADD TASK
// =========================================

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const taskText =
            taskInput.value.trim();


        // Check empty task

        if (taskText === "") {

            errorMessage.textContent =
                "Please enter a task first.";

            taskInput.focus();

            return;
        }


        // Clear error

        errorMessage.textContent = "";


        // Create task object

        const newTask = {

            id: Date.now(),

            text: taskText,

            completed: false,

            createdAt: new Date().toLocaleString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                }
            ),

            completedAt: null

        };


        // Add task

        tasks.push(newTask);


        // Save

        saveTasks();


        // Clear input

        taskInput.value = "";


        // Update display

        renderTasks();

        taskInput.focus();

    }
);


// =========================================
// RENDER TASKS
// =========================================

function renderTasks() {

    const pendingTasks =
        tasks.filter(
            task => !task.completed
        );


    const completedTasks =
        tasks.filter(
            task => task.completed
        );


    // Update counts

    pendingCount.textContent =
        pendingTasks.length;

    completedCount.textContent =
        completedTasks.length;

    pendingBadge.textContent =
        pendingTasks.length;

    completedBadge.textContent =
        completedTasks.length;


    // Clear containers

    pendingTasksContainer.innerHTML = "";

    completedTasksContainer.innerHTML = "";


    // Render pending

    if (pendingTasks.length === 0) {

        pendingTasksContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ✓
                </div>

                <h3>No pending tasks</h3>

                <p>
                    You're all caught up!
                </p>

            </div>

        `;

    } else {

        pendingTasks.forEach(
            task => {

                pendingTasksContainer.appendChild(
                    createTaskElement(task)
                );

            }
        );

    }


    // Render completed

    if (completedTasks.length === 0) {

        completedTasksContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ○
                </div>

                <h3>No completed tasks</h3>

                <p>
                    Completed tasks will appear here.
                </p>

            </div>

        `;

    } else {

        completedTasks.forEach(
            task => {

                completedTasksContainer.appendChild(
                    createTaskElement(task)
                );

            }
        );

    }

}


// =========================================
// CREATE TASK ELEMENT
// =========================================

function createTaskElement(task) {

    const taskItem =
        document.createElement("div");


    taskItem.className =
        "task-item";


    if (task.completed) {

        taskItem.classList.add("completed");

    }


    // Check button

    const checkButton =
        document.createElement("button");

    checkButton.className =
        "task-check";

    checkButton.innerHTML =
        task.completed ? "✓" : "";

    checkButton.title =
        task.completed
            ? "Mark as pending"
            : "Mark as complete";


    checkButton.addEventListener(
        "click",
        function () {

            toggleTask(task.id);

        }
    );


    // Task details

    const details =
        document.createElement("div");

    details.className =
        "task-details";


    const taskText =
        document.createElement("p");

    taskText.className =
        "task-text";

    taskText.textContent =
        task.text;


    const taskTime =
        document.createElement("span");

    taskTime.className =
        "task-time";


    if (task.completed && task.completedAt) {

        taskTime.textContent =
            `Completed ${task.completedAt}`;

    } else {

        taskTime.textContent =
            `Added ${task.createdAt}`;

    }


    details.appendChild(taskText);

    details.appendChild(taskTime);


    // Actions

    const actions =
        document.createElement("div");

    actions.className =
        "task-actions";


    // Edit button

    const editButton =
        document.createElement("button");

    editButton.className =
        "action-btn edit-btn";

    editButton.textContent =
        "✎";

    editButton.title =
        "Edit task";


    editButton.addEventListener(
        "click",
        function () {

            editTask(
                task.id,
                details,
                taskText,
                taskTime
            );

        }
    );


    // Delete button

    const deleteButton =
        document.createElement("button");

    deleteButton.className =
        "action-btn delete-btn";

    deleteButton.textContent =
        "×";

    deleteButton.title =
        "Delete task";


    deleteButton.addEventListener(
        "click",
        function () {

            deleteTask(task.id);

        }
    );


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    // Build task

    taskItem.appendChild(checkButton);

    taskItem.appendChild(details);

    taskItem.appendChild(actions);


    return taskItem;
}


// =========================================
// TOGGLE TASK
// =========================================

function toggleTask(taskId) {

    const task =
        tasks.find(
            task => task.id === taskId
        );


    if (!task) {
        return;
    }


    task.completed =
        !task.completed;


    if (task.completed) {

        task.completedAt =
            new Date().toLocaleString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                }
            );

    } else {

        task.completedAt = null;

    }


    saveTasks();

    renderTasks();
}


// =========================================
// EDIT TASK
// =========================================

function editTask(
    taskId,
    details,
    taskText,
    taskTime
) {

    const task =
        tasks.find(
            task => task.id === taskId
        );


    if (!task) {
        return;
    }


    const editInput =
        document.createElement("input");

    editInput.type = "text";

    editInput.className =
        "edit-input";

    editInput.value =
        task.text;


    details.replaceChild(
        editInput,
        taskText
    );


    editInput.focus();

    editInput.select();


    function saveEdit() {

        const newText =
            editInput.value.trim();


        if (newText === "") {

            task.text =
                task.text;

        } else {

            task.text =
                newText;

        }


        saveTasks();

        renderTasks();

    }


    editInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                saveEdit();

            }


            if (event.key === "Escape") {

                renderTasks();

            }

        }
    );


    editInput.addEventListener(
        "blur",
        saveEdit
    );

}


// =========================================
// DELETE TASK
// =========================================

function deleteTask(taskId) {

    tasks =
        tasks.filter(
            task => task.id !== taskId
        );


    saveTasks();

    renderTasks();
}


// =========================================
// INITIAL DISPLAY
// =========================================

renderTasks();