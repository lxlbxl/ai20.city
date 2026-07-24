<?php
// backend/api/auth.php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($username) || empty($password)) {
        jsonResponse(['status' => 'error', 'message' => 'Username and password required'], 400);
    }

    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->execute([':username' => $username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // In a real app, generate a JWT here. For simple SPA+PHP on shared hosting, 
            // we can just return success and let client handle "logged in" state 
            // or set a PHP session cookie if same-domain.
            // Since this is decoupled, we'll return a simple dummy token/user info.

            jsonResponse([
                'status' => 'success',
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'role' => $user['role']
                ],
                'token' => 'simple-token-' . bin2hex(random_bytes(16)) // Dummy token for client-side check
            ]);
        } else {
            jsonResponse(['status' => 'error', 'message' => 'Invalid credentials'], 401);
        }

    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
} else {
    jsonResponse(['status' => 'error', 'message' => 'Method not allowed'], 405);
}
?>