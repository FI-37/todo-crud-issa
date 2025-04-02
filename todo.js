document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'todo-api.php';

    const handleResponse = response => {
        if (!response.ok) {
            throw new Error(`Server-Fehler: ${response.status}`);
        }
        return response.text().then(text => text ? JSON.parse(text) : {}); // Prüft auf leere Antwort
    };

    const getUpdateButton = item => {
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Aktualisieren';

        updateButton.addEventListener('click', function() {
            document.getElementById('todo-id').value = item.id;
            document.getElementById('todo-update-input').value = item.title;
            document.getElementById('todo-update-form').style.display = 'block';

            fetch(apiUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: item.id, title: item.title })
            })
            .then(handleResponse)
            .then(() => fetchTodos())
            .catch(error => console.error('Fehler beim Aktualisieren:', error));
        });

        return updateButton;
    };

    const getDeleteButton = item => {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Löschen';

        deleteButton.addEventListener('click', function() {
            fetch(apiUrl, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: item.id })
            })
            .then(handleResponse)
            .then(() => fetchTodos())
            .catch(error => console.error('Fehler beim Löschen:', error));
        });

        return deleteButton;
    };

    const getCompleteButton = item => {
        const completeButton = document.createElement('button');
        completeButton.textContent = item.completed ? 'Erledigt' : 'JUST DO IT';

        completeButton.addEventListener('click', function() {
            fetch(apiUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: item.id, completed: item.completed ? 0 : 1 })
            })
            .then(handleResponse)
            .then(() => fetchTodos())
            .catch(error => console.error('Fehler beim Aktualisieren des Status:', error));
        });

        return completeButton;
    };

    const fetchTodos = () => {
        fetch(apiUrl)
        .then(handleResponse)
        .then(data => {
            const todoList = document.getElementById('todo-list');
            todoList.innerHTML = "";
            data.forEach(item => {
                const li = document.createElement('li');
                const span = document.createElement('span');
                span.textContent = item.title;
                if (item.completed) {
                    span.style.textDecoration = 'line-through';
                }
                li.appendChild(span);
                li.appendChild(getDeleteButton(item));
                li.appendChild(getCompleteButton(item));
                li.appendChild(getUpdateButton(item));

                todoList.appendChild(li);
            });
        })
        .catch(error => console.error('Fehler beim Abrufen der Todos:', error));
    };

    document.getElementById('todo-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const inputElement = document.getElementById('todo-input');
        const todoInput = inputElement.value.trim();
        if (!todoInput) return; // Verhindert das Senden leerer Todos
        inputElement.value = "";

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: todoInput })
        })
        .then(handleResponse)
        .then(() => fetchTodos())
        .catch(error => console.error('Fehler beim Hinzufügen:', error));
    });

    document.getElementById('todo-update-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('todo-id').value;
        const todoInput = document.getElementById('todo-update-input').value.trim();
        if (!id || !todoInput) return;

        fetch(apiUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, title: todoInput })
        })
        .then(handleResponse)
        .then(updatedItem => {
            fetchTodos();
            if (updatedItem.status === 'success') {
                document.getElementById('todo-update-form').style.display = 'none';
                alert("Daten erfolgreich geändert");
            } else {
                alert("Fehler bei der Datenübertragung");
            }
        })
        .catch(error => console.error('Fehler beim Aktualisieren:', error));
    });

    fetchTodos();
});
