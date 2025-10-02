<?php
header('Content-Type: application/json; charset=utf-8');

// Mostrar errores para depuración (solo local)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Incluir la conexión a la base de datos
require_once __DIR__ . '/db.php'; // Ajusta la ruta según tu estructura

// Leer datos JSON
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    echo json_encode(['success' => false, 'message' => 'No se recibió JSON']);
    exit;
}

// Variables
$Nombre = trim($input['nombre'] ?? '');
$Apellido = trim($input['apellido'] ?? '');
$Telefono = trim($input['telefono'] ?? '');
$Usuario = trim($input['usuario'] ?? '');
$Contrasena = $input['password'] ?? '';

// Validación básica
if (!$Nombre || !$Apellido || !$Telefono || !$Usuario || !$Contrasena) {
    echo json_encode(['success' => false, 'message' => 'Faltan campos requeridos']);
    exit;
}

try {
    // Verificar si el usuario ya existe
    $stmt = $pdo->prepare('SELECT id FROM registro WHERE Usuario = ? LIMIT 1');
    $stmt->execute([$Usuario]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'El usuario ya existe']);
        exit;
    }

    // Cifrar contraseña
    $hash = password_hash($Contrasena, PASSWORD_DEFAULT);

    // Insertar nuevo usuario
    $stmt = $pdo->prepare('INSERT INTO registro (Nombre, Apellido, Numerotelefono, Usuario, Contrasena, Confirmarcontrasena) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$Nombre, $Apellido, $Telefono, $Usuario, $hash, $hash]);

    echo json_encode(['success' => true, 'message' => 'Registro exitoso']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor',
        'error' => $e->getMessage()
    ]);
}




