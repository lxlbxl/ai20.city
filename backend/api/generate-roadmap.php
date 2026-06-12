<?php
// backend/api/generate-roadmap.php
// Enable Error Reporting for Debugging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't print errors to output, chaos for JSON
ini_set('log_errors', 1);
ini_set('error_log', '../error_log.txt');
set_time_limit(120); // Extend timeout to 2 mins for AI generation

// Handle Fatal Errors
register_shutdown_function(function () {
    $error = error_get_last();
    if ($error && ($error['type'] === E_ERROR || $error['type'] === E_PARSE || $error['type'] === E_CORE_ERROR || $error['type'] === E_COMPILE_ERROR)) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Fatal Error: ' . $error['message'] . ' on line ' . $error['line']]);
        exit;
    }
});

require_once '../config.php';
require_once '../classes/AutomationOrchestrator.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        jsonResponse(['status' => 'error', 'message' => 'Invalid JSON Input'], 400);
    }

    $leadId = $input['lead_id'] ?? null;

    if (!$leadId) {
        jsonResponse(['status' => 'error', 'message' => 'Missing Lead ID'], 400);
    }

    // AUTO-MIGRATION: Ensure columns exist
    try {
        $columns = $pdo->query("PRAGMA table_info(leads)")->fetchAll(PDO::FETCH_COLUMN, 1);
        if (!in_array('roadmap_status', $columns)) {
            $pdo->exec("ALTER TABLE leads ADD COLUMN roadmap_status TEXT DEFAULT 'pending'");
        }
        if (!in_array('roadmap_content', $columns)) {
            $pdo->exec("ALTER TABLE leads ADD COLUMN roadmap_content TEXT");
        }
    } catch (Exception $e) {
        // Continue, if it fails here, the query below will likely fail too, but we tried.
        error_log("Schema Migration Warning: " . $e->getMessage());
    }

    try {
        // Set lead status to generating
        if ($stmt = $pdo->prepare("UPDATE leads SET roadmap_status = 'generating' WHERE id = ?")) {
            $stmt->execute([$leadId]);
        } else {
            throw new Exception("Database prepare failed: " . implode(" ", $pdo->errorInfo()));
        }

        // Run orchestration
        $orchestrator = new AutomationOrchestrator($pdo);
        $roadmap = $orchestrator->generateRoadmap($leadId);

        jsonResponse(['status' => 'success', 'data' => $roadmap]);

    } catch (Throwable $e) {
        $pdo->prepare("UPDATE leads SET roadmap_status = 'failed' WHERE id = ?")->execute([$leadId]);
        error_log("Generate Roadmap Error: " . $e->getMessage());
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
} else {
    jsonResponse(['status' => 'error', 'message' => 'Method not allowed'], 405);
}
?>