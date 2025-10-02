<?php
// db.php - Configuración PDO para MySQL
$DB_HOST = '127.0.0.1:3306';      // o 'localhost'
$DB_NAME = 'taggysql';       // Nombre de tu base de datos
$DB_USER = 'root';            // Usuario MySQL
$DB_PASS = '';                // Contraseña (XAMPP local normalmente es vacía)
$DB_CHARSET = 'utf8mb4';

$dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset={$DB_CHARSET}";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, $options);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error de conexión a la base de datos',
        'error' => $e->getMessage()
    ]);
    exit;
}