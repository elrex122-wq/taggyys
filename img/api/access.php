<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../api/db.php'; // Ajusta según tu estructura

$input = json_decode(file_get_contents('php://input'), true);

$nombre = trim($input['nombre'] ?? '');
$apellido = trim($input['apellido'] ?? '');
$telefono = trim($input['telefono'] ?? '');
$usuario = trim($input['usuario'] ?? '');
$password = $input['password'] ?? '';
$confirmar = trim($input['confirmar'] ?? '');

if (!$nombre || !$apellido || !$telefono || !$usuario || !$password || !$confirmar) {
    echo json_encode(['success' => false, 'message' => 'Faltan campos']);
    exit;
}

if ($password !== $confirmar) {
    echo json_encode(['success' => false, 'message' => 'Las contraseñas no coinciden']);
    exit;
}

try {
    // Verificar si usuario existe
    $stmt = $pdo->prepare('SELECT Usuario FROM registro WHERE Usuario = ? LIMIT 1');
    $stmt->execute([$usuario]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Usuario ya existe']);
        exit;
    }

    // Insertar usuario
    $stmt = $pdo->prepare('INSERT INTO registro (Nombre, Apellido, Numerotelefono, Usuario, Contrasena, Confirmarcontrasena) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$nombre, $apellido, $telefono, $usuario, $password, $password]);

    echo json_encode(['success' => true, 'message' => 'Registro exitoso']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error servidor', 'error' => $e->getMessage()]);
}