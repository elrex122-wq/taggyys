<?php
// api/login.php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

$input = json_decode(file_get_contents('php://input'), true);
$usuario = trim($input['usuario'] ?? '');
$password = $input['password'] ?? '';

if (!$usuario || !$password) {
    echo json_encode(['success' => false, 'message' => 'Usuario y contraseña son requeridos']);
    exit;
}

try {
    $stmt = $pdo->prepare('SELECT * FROM registro WHERE Usuario = ? LIMIT 1');
    $stmt->execute([$usuario]);
    $user = $stmt->fetch();

    if (!$user || $user['Contrasena'] !== $password) {
        echo json_encode(['success' => false, 'message' => 'Usuario o contraseña incorrectos']);
        exit;
    }

    session_start();
    $_SESSION['user'] = $user;

    echo json_encode(['success' => true, 'user' => $user]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false,
                      'message' => 'Error servidor',
                      'error'   => $e->getMessage()]);
}
