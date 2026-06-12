<?php
// backend/api/clients.php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        // Fetch leads that are marked as clients OR have 'client' status
        // We can just filter leads by status = 'client'
        $stmt = $pdo->query("SELECT * FROM leads WHERE status = 'client' ORDER BY created_at DESC");
        $clients = $stmt->fetchAll();
        jsonResponse(['status' => 'success', 'data' => $clients]);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
} elseif ($method === 'POST') {
    // Create a new Client (basically a Lead with status='client')
    $input = json_decode(file_get_contents('php://input'), true);

    try {
        $sql = "INSERT INTO leads (
            first_name, last_name, email, phone, company, status, product_interest
        ) VALUES (
            :firstName, :lastName, :email, :phone, :company, 'client', :productInterest
        )";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':firstName' => $input['firstName'] ?? '',
            ':lastName' => $input['lastName'] ?? '',
            ':email' => $input['email'] ?? '',
            ':phone' => $input['phone'] ?? '',
            ':company' => $input['company'] ?? '',
            ':productInterest' => $input['productInterest'] ?? ''
        ]);

        jsonResponse(['status' => 'success', 'message' => 'Client created', 'id' => $pdo->lastInsertId()], 201);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
} elseif ($method === 'PATCH') {
    // Update Client
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || !isset($input['id'])) {
        jsonResponse(['status' => 'error', 'message' => 'Missing ID'], 400);
    }

    try {
        $fields = [];
        $params = [':id' => $input['id']];

        if (isset($input['status'])) {
            $fields[] = "status = :status";
            $params[':status'] = $input['status'];
        }
        if (isset($input['product_interest'])) {
            $fields[] = "product_interest = :product";
            $params[':product'] = $input['product_interest'];
        }
        if (isset($input['company'])) {
            $fields[] = "company = :company";
            $params[':company'] = $input['company'];
        }
        if (isset($input['notes'])) {
            $fields[] = "notes = :notes";
            $params[':notes'] = $input['notes'];
        }

        if (empty($fields))
            jsonResponse(['status' => 'success', 'message' => 'No changes']);

        $sql = "UPDATE leads SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        jsonResponse(['status' => 'success', 'message' => 'Client updated']);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
} else {
    jsonResponse(['status' => 'error', 'message' => 'Method not allowed'], 405);
}
?>