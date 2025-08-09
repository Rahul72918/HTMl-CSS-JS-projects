// Get references to DOM elements
const inputBox = document.getElementById("inputBox");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

// Will store the "Edit" target when editing a todo
let editTodo = null;

// Function to add or update a todo
const addTodo = () => {
    const inputText = inputBox.value.trim(); // Get input value without extra spaces

    if (inputText.length > 0) { // Only run if not empty

        // If the button says "Edit", we are updating an existing task
        if (addBtn.value === "Edit") {
            // Update the text inside the <p> tag of the task being edited
            editLocalTodo(editTodo.target.previousElementSibling.innerHTML);
            editTodo.target.previousElementSibling.innerHTML = inputText;

            // Reset button to "Add" mode
            addBtn.value = "Add";
            inputBox.value = "";
        }
        // Otherwise, add a brand-new task
        else {
            // Create <li> container
            const li = document.createElement("li");

            // Create <p> for task text
            const p = document.createElement("p");
            p.innerHTML = inputText;
            li.appendChild(p);

            // Create "Edit" button
            const editBtn = document.createElement("button");
            editBtn.innerText = "Edit";
            editBtn.classList.add("editBtn");
            li.appendChild(editBtn);

            // Create "Remove" button
            const deleteBtn = document.createElement("button");
            deleteBtn.innerText = "Remove";
            deleteBtn.classList.add("deleteBtn");
            li.appendChild(deleteBtn);

            // Add new task to the list in the DOM
            todoList.appendChild(li);

            // Clear input field
            inputBox.value = "";

            // Save task to localStorage
            saveTodo(inputText);
        }
    }
};

// Handles clicks inside the todo list (Edit or Remove buttons)
const updateTodo = (e) => {
    // Remove task
    if (e.target.innerHTML === "Remove") {
        todoList.removeChild(e.target.parentElement); // Remove <li> from DOM
        deleteLocalTodo(e.target.parentElement);      // Remove from localStorage
    }

    // Edit task
    if (e.target.innerHTML === "Edit") {
        // Fill input field with current text
        inputBox.value = e.target.previousElementSibling.innerHTML;
        inputBox.focus(); // Focus for immediate editing
        addBtn.value = "Edit"; // Change button to edit mode
        editTodo = e; // Store event for later reference
    }
};

// Save new todo to localStorage
const saveTodo = (todo) => {
    let todos = localStorage.getItem("todos") 
        ? JSON.parse(localStorage.getItem("todos")) 
        : [];
    
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Load todos from localStorage when the page loads
const getTodos = () => {
    let todos = localStorage.getItem("todos") 
        ? JSON.parse(localStorage.getItem("todos")) 
        : [];

    // Create DOM elements for each stored todo
    todos.forEach(todo => {
        const li = document.createElement("li");

        const p = document.createElement("p");
        p.innerHTML = todo;
        li.appendChild(p);

        const editBtn = document.createElement("button");
        editBtn.innerText = "Edit";
        editBtn.classList.add("editBtn");
        li.appendChild(editBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Remove";
        deleteBtn.classList.add("deleteBtn");
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
        inputBox.value = "";
    });
};

// Delete todo from localStorage
const deleteLocalTodo = (todo) => {
    let todos = localStorage.getItem("todos") 
        ? JSON.parse(localStorage.getItem("todos")) 
        : [];

    let todoText = todo.children[0].innerHTML; // Get the text of the todo
    let todoIndex = todos.indexOf(todoText);   // Find it in the array

    todos.splice(todoIndex, 1); // Remove it
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Update existing todo in localStorage
const editLocalTodo = (todo) => {
    let todos = JSON.parse(localStorage.getItem("todos"));
    let todoIndex = todos.indexOf(todo); // Find its index
    todos[todoIndex] = inputBox.value;   // Replace text
    localStorage.setItem("todos", JSON.stringify(todos));
};

// Event listeners
document.addEventListener("DOMContentLoaded", getTodos); // Load stored todos on page load
addBtn.addEventListener('click', addTodo);                // Handle add/update clicks
todoList.addEventListener('click', updateTodo);           // Handle remove/edit clicks
