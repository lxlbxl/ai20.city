<?php
// backend/api/user.php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'PUT' || $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    // We assume the user is authenticated via the frontend passing the user ID or token.
    // Since we are using a simple password match in auth.php without sessions, 
    // we will require 'username', 'currentPassword', and 'newPassword' for security 
    // to verify the user before changing it.

    $username = $input['username'] ?? '';
    $currentPassword = $input['currentPassword'] ?? '';
    $newPassword = $input['newPassword'] ?? '';

    if (empty($username) || empty($currentPassword) || empty($newPassword)) {
        jsonResponse(['status' => 'error', 'message' => 'Missing required fields'], 400);
    }

    try {
        // Verify current credentials
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->execute([':username' => $username]);
        $user = $stmt->fetch();

        if ($user && password_verify($currentPassword, $user['password'])) {
            // Update password
            $newHash = password_hash($newPassword, PASSWORD_DEFAULT);
            $updateStmt = $pdo->prepare("UPDATE users SET password = :password WHERE id = :id");
            $updateStmt->execute([':password' => $newHash, ':id' => $user['id']]);

            jsonResponse(['status' => 'success', 'message' => 'Password updated successfully']);
        } else {
            jsonResponse(['status' => 'error', 'message' => 'Invalid current password'], 401);
        }

    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
} else {
    jsonResponse(['status' => 'error', 'message' => 'Method not allowed'], 405);
}
?>