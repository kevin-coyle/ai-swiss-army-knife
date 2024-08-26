// Select the input, button, and ul (unordered list)
const todoInput = document.querySelector('#todo-input');
const addButton = document.querySelector('#add-todo');
const todoList = document.querySelector('#todo-list');

// Function to add a new todo item
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText !== '') {
        const listItem = document.createElement('li');
        listItem.textContent = todoText;
        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = function() {
            todoList.removeChild(listItem);
        };
        // Append button to the list item
        listItem.appendChild(deleteButton);
        // Append list item to the ul
        todoList.appendChild(listItem);
        // Clear the input field
        todoInput.value = '';
    }
}

// Event listeners for the add button click and keypress
addButton.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});