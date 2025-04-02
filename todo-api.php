<?php
header('Content-Type: application/json');
 
// MySQL-Datenbankverbindungsinformationen
$host = '127.0.0.1';
$db = 'todo_list';
$user = 'lu';
$pass = '12345';
$charset = 'utf8mb4';
 
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
];
 
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log("Datenbankverbindungsfehler: " . $e->getMessage());
    die("Datenbankverbindung fehlgeschlagen");
}
 
// Log-Funktion in PHP
function write_log($action, $data) {
    $logFile = 'log.txt'; // Überprüfe den richtigen Pfad, falls das Log außerhalb des aktuellen Verzeichnisses gespeichert werden soll.
    $log = fopen($logFile, 'a');
    $timestamp = date('Y-m-d H:i:s');
    fwrite($log, "$timestamp - $action: " . json_encode($data) . "\n");
    fclose($log);
}
 
$todo_file = 'todo.json';  // Definiere den Pfad der JSON-Datei
 
// Lade die existierenden Todos, falls vorhanden
if (file_exists($todo_file)) {
    $todo_items = json_decode(file_get_contents($todo_file), true);
} else {
    $todo_items = [];  // Initialisiere ein leeres Array, wenn keine Datei existiert
}
 
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        try {
            // TODO-Items aus der Datenbank holen
            $statement = $pdo->query("SELECT * FROM todo");
            $todo_items = $statement->fetchAll();
   
            if ($todo_items === false) {
                // Keine Daten gefunden
                echo json_encode(['error' => 'Keine To-Do-Einträge gefunden']);
            } else {
                echo json_encode($todo_items);
            }
        } catch (Exception $e) {
            // Fehlerprotokollierung im Falle eines Problems
            error_log("Fehler beim Abrufen der To-Dos: " . $e->getMessage());
            echo json_encode(['error' => 'Fehler beim Abrufen der To-Dos']);
        }
        break;
   
    case 'POST':
        // Daten aus dem Input Stream holen
        $data = json_decode(file_get_contents('php://input'), true);
        // Neues Todo-Item erstellen
        $new_todo = ["id" => uniqid(), "title" => $data['title']];
        // Das neue Element zur Todo-Liste hinzufügen
        $todo_items[] = $new_todo;
        // Die To-Do-Items in die JSON-Datei schreiben
        file_put_contents($todo_file, json_encode($todo_items));
        // Das neue Element zurückgeben
        echo json_encode($new_todo);
        break;
   
    case 'PUT':
        // TODO-Update-Logik (nicht implementiert)
        break;
 
    case 'DELETE':
        // Daten aus dem Input Stream holen
        $data = json_decode(file_get_contents('php://input'), true);
       
        if (!$data || !isset($data['id'])) {
            // Wenn die Daten ungültig sind, gebe eine Fehlerantwort zurück
            echo json_encode(['error' => 'Ungültige ID']);
            break;
        }
 
        // Todo aus der Liste löschen
        try {
            $statement = $pdo->prepare("DELETE FROM todo WHERE id = :id");
            $statement->execute(['id' => $data['id']]);
 
            // Überprüfen, ob die Zeile erfolgreich gelöscht wurde
            if ($statement->rowCount() > 0) {
                echo json_encode(['status' => 'success']);
            } else {
                echo json_encode(['status' => 'failed', 'message' => 'Element nicht gefunden']);
            }
           
            // Löschen in das Log schreiben
            write_log("DELETE", $data);
        } catch (Exception $e) {
            // Fehlerprotokollierung im Falle eines Problems
            error_log("Fehler beim Löschen der To-Do: " . $e->getMessage());
            echo json_encode(['error' => 'Fehler beim Löschen der To-Do']);
        }
        break;
}
?>