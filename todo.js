document.addEventListener('DOMContentLoaded', function() {
 
    // Define the URL to our CRUD server API
    const apiUrl = "todo-api.php";

    const getDeleteButton = (item) => {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Löschen';
 
        deleteButton.addEventListener('click', function() {
            fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: item.id })
            })
            .then(response => response.json())
            .then(() => fetchTodos()) // Reload todo list
            .catch(error => console.error('Löschfehler:', error));
        });
 
        return deleteButton;
    };
    
    document.getElementById('todo-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const inputElement = document.getElementById('todo-input');
        const todoInput = inputElement.value.trim();
        //if (!todoInput) return; // Verhindert leere Einträge
        inputElement.value = "";

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: todoInput })
        })
        .then(response => response.json())
        .then(data => {
            const todoList = document.getElementById('todo-list');
            const li = document.createElement('li');
            li.textContent = data.title;
            li.appendChild(getDeleteButton(data));
            todoList.appendChild(li);
        })
        .catch(error => console.error('Fehler beim Hinzufügen:', error));
    });

    const fetchTodos = () => {
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const todoList = document.getElementById('todo-list');
            todoList.innerHTML = ""; // Verhindert doppelte Einträge
            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.title;
                li.appendChild(getDeleteButton(item));
                todoList.appendChild(li);
            });
        })
    };

    fetchTodos();
});