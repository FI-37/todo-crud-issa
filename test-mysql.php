<?php
$mysqli = new mysqli("localhost", "lu", "12345", "users");
 
if ($mysqli->connect_error) {
    die("Verbindung fehlgeschlagen: " . $mysqli->connect_error);
}
 
echo "Erfolgreich verbunden!";
?>
 