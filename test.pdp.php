<?php

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
} catch (\PDOException $e) {
    error_log("PDOException: " . $e->getMessage() . " in "
              . $e->getFile() . " on line " . $e->getLine());
    die("Datenbankverbindung fehlgeschlagen!");
}

// Query ausführen
//$statement = $pdo->query("SELECT * FROM users");

// fetchAll richtig aufrufen
//$users = $statement->fetchAll();

//echo "<pre>";
//var_dump($users);
//echo "</pre>";


$statement = $pdo->query("SELECT * FROM todo");
$todo_items = $statement->fetchAll();
foreach ($todo_items as $todo) {
   // echo $todo['uid'] . "<br>";
    //echo $todo['title'] . "<br>";
    //echo $todo['completed'] . "<br>";
}
echo "<pre>";
var_dump($todo_items);
echo "</pre>";
?>
