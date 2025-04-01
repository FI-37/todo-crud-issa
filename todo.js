document.addEventListener('DOMContentLoaded', function() {

    // Define the URL to our CRUD server API
    const apiUrl = "todo-api.php";

    // Function to create a delete button
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
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fehler beim Löschen');
                }
                return response.json();
            })
            .then(data => {
                console.log('Löschantwort:', data);
                if (data.status === 'success') {
                    fetchTodos(); // Reload todo list
                } else {
                    console.error('Fehler beim Löschen:', data.message || 'Unbekannter Fehler');
                }
            })
            .catch(error => {
                console.error('Löschfehler:', error);
            });
        });

        return deleteButton;
    };

    // Event listener for form submission
    document.getElementById('todo-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const inputElement = document.getElementById('todo-input');
        const todoInput = inputElement.value.trim();

        if (!todoInput) return; // Prevent empty entries

        inputElement.value = "";

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: todoInput })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Fehler beim Hinzufügen');
            }
            return response.json();
        })
        .then(data => {
            const todoList = document.getElementById('todo-list');
            const li = document.createElement('li');
            li.textContent = data.title;
            li.appendChild(getDeleteButton(data));
            todoList.appendChild(li);
        })
        .catch(error => console.error('Fehler beim Hinzufügen:', error));
    });

    // Function to fetch and display todos
    const fetchTodos = () => {
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fehler beim Abrufen der To-Dos');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                    return;
                }
                const todoList = document.getElementById('todo-list');
                todoList.innerHTML = ""; // Verhindert doppelte Einträge
                data.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item.title;
                    li.appendChild(getDeleteButton(item));
                    todoList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Fehler:', error);
            });
    };

    // Initial fetch to load todos when the page is loaded
    fetchTodos();
});
