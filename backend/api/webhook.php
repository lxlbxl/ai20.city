<?php
// backend/api/webhook.php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    // In a real scenario, this URL would be stored in the DB settings
    // For now, we expect it in the body for testing or hardcoded
    $targetUrl = $input['targetUrl'] ?? '';

    if (empty($targetUrl)) {
        jsonResponse(['status' => 'error', 'message' => 'Target URL required'], 400);
    }

    try {
        // Fetch pending leads or specific leads based on input
        // For this MVP, let's say we send the latest lead
        $stmt = $pdo->query("SELECT * FROM leads ORDER BY created_at DESC LIMIT 1");
        $lead = $stmt->fetch();

        if (!$lead) {
            jsonResponse(['status' => 'error', 'message' => 'No leads to process'], 404);
        }

        // Send to n8n/Automation
        $ch = curl_init($targetUrl);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($lead));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        jsonResponse([
            'status' => 'success',
            'message' => 'Webhook triggered',
            'upstream_status' => $httpCode,
            'upstream_response' => $response
        ]);

    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
} else {
    jsonResponse(['status' => 'error', 'message' => 'Method not allowed'], 405);
}
?>