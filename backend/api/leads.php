<?php
// backend/api/leads.php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM leads ORDER BY created_at DESC");
        $leads = $stmt->fetchAll();
        jsonResponse(['status' => 'success', 'data' => $leads]);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        jsonResponse(['status' => 'error', 'message' => 'Invalid JSON input'], 400);
    }

    try {
        $sql = "INSERT INTO leads (
            first_name, last_name, email, phone, company, 
            industry, location, company_size, challenges, 
            ai_usage, timeline, budget, consent
        ) VALUES (
            :firstName, :lastName, :email, :phone, :company, 
            :industry, :location, :size, :challenges, 
            :aiUsage, :timeline, :budget, :consent
        )";

        $stmt = $pdo->prepare($sql);

        // Handle array to string conversion for challenges if needed
        $challengesInput = $input['challenges'] ?? '';
        $challenges = is_array($challengesInput) ? implode(', ', $challengesInput) : $challengesInput;
        $consent = isset($input['consent']) ? 1 : 0;

        $stmt->execute([
            ':firstName' => $input['firstName'] ?? '',
            ':lastName' => $input['lastName'] ?? '',
            ':email' => $input['email'] ?? '',
            ':phone' => $input['phone'] ?? '',
            ':company' => $input['company'] ?? '',
            ':industry' => $input['industry'] ?? '',
            ':location' => $input['location'] ?? '',
            ':size' => $input['companySize'] ?? ($input['size'] ?? ''), // Handle potential naming mismatch
            ':challenges' => $challenges,
            ':aiUsage' => $input['aiUsage'] ?? '',
            ':timeline' => $input['timeline'] ?? '',
            ':budget' => $input['budget'] ?? '',
            ':consent' => $consent
        ]);

        $leadId = $pdo->lastInsertId();

        // Check for Auto-Generate Setting
        $stmtSettings = $pdo->query("SELECT auto_generate FROM ai_settings ORDER BY id DESC LIMIT 1");
        $settings = $stmtSettings->fetch();

        if ($settings && $settings['auto_generate'] == 1) {
            // Trigger Automation
            // We need to include the class if not already included
            require_once '../classes/AutomationOrchestrator.php';

            try {
                $pdo->prepare("UPDATE leads SET roadmap_status = 'generating' WHERE id = ?")->execute([$leadId]);
                $orchestrator = new AutomationOrchestrator($pdo);
                $orchestrator->generateRoadmap($leadId);
            } catch (Exception $e) {
                // Log error but don't fail the lead creation response
                error_log("Auto-Generate Failed for Lead $leadId: " . $e->getMessage());
                // Optional: update status to failed
                $pdo->prepare("UPDATE leads SET roadmap_status = 'failed' WHERE id = ?")->execute([$leadId]);
            }
        }

        jsonResponse(['status' => 'success', 'message' => 'Lead created successfully', 'id' => $leadId], 201);

    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
} elseif ($method === 'PATCH') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['id'])) {
        jsonResponse(['status' => 'error', 'message' => 'Invalid input or missing ID'], 400);
    }

    try {
        $fields = [];
        $params = [':id' => $input['id']];

        if (isset($input['status'])) {
            $fields[] = "status = :status";
            $params[':status'] = $input['status'];
        }

        if (isset($input['notes'])) {
            $fields[] = "notes = :notes";
            $params[':notes'] = $input['notes'];
        }

        // Add other fields as needed

        if (empty($fields)) {
            jsonResponse(['status' => 'success', 'message' => 'No changes made']);
        }

        $sql = "UPDATE leads SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        jsonResponse(['status' => 'success', 'message' => 'Lead updated successfully']);

    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
} else {
    jsonResponse(['status' => 'error', 'message' => 'Method not allowed'], 405);
}
?>