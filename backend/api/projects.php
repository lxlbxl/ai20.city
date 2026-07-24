<?php
// backend/api/projects.php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $clientId = $_GET['client_id'] ?? null;
    try {
        if ($clientId) {
            $stmt = $pdo->prepare("SELECT * FROM projects WHERE client_id = :clientId ORDER BY created_at DESC");
            $stmt->execute([':clientId' => $clientId]);
        } else {
            $stmt = $pdo->query("SELECT * FROM projects ORDER BY created_at DESC");
        }
        jsonResponse(['status' => 'success', 'data' => $stmt->fetchAll()]);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['client_id']) || !isset($input['name'])) {
        jsonResponse(['status' => 'error', 'message' => 'Missing required fields'], 400);
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO projects (client_id, name, status, product, description) VALUES (:clientId, :name, :status, :product, :description)");
        $stmt->execute([
            ':clientId' => $input['client_id'],
            ':name' => $input['name'],
            ':status' => $input['status'] ?? 'active',
            ':product' => $input['product'] ?? '',
            ':description' => $input['description'] ?? ''
        ]);
        jsonResponse(['status' => 'success', 'message' => 'Project created', 'id' => $pdo->lastInsertId()], 201);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
} elseif ($method === 'PATCH') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || !isset($input['id'])) {
        jsonResponse(['status' => 'error', 'message' => 'Missing ID'], 400);
    }

    try {
        $fields = [];
        $params = [':id' => $input['id']];

        $updatable = ['name', 'status', 'product', 'description'];
        foreach ($updatable as $field) {
            if (isset($input[$field])) {
                $fields[] = "$field = :$field";
                $params[":$field"] = $input[$field];
            }
        }

        if (empty($fields))
            jsonResponse(['status' => 'success', 'message' => 'No changes']);

        $stmt = $pdo->prepare("UPDATE projects SET " . implode(', ', $fields) . " WHERE id = :id");
        $stmt->execute($params);
        jsonResponse(['status' => 'success', 'message' => 'Project updated']);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
} else {
    jsonResponse(['status' => 'error', 'message' => 'Method not allowed'], 405);
}
?>