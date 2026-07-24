<?php
// backend/api/ai-settings.php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM ai_settings ORDER BY id DESC LIMIT 1");
        $settings = $stmt->fetch();

        if ($settings) {
            // Mask API Key for security
            if (!empty($settings['api_key'])) {
                $settings['api_key'] = substr($settings['api_key'], 0, 4) . '...' . substr($settings['api_key'], -4);
            }
        } else {
            $settings = [
                'provider' => 'openrouter',
                'model' => '',
                'api_key' => '',
                'roadmap_webhook_url' => ''
            ];
        }

        jsonResponse(['status' => 'success', 'data' => $settings]);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $provider = $input['provider'] ?? 'openrouter';
    $model = $input['model'] ?? 'liquid/lfm-40b:free';
    $apiKey = $input['api_key'] ?? '';
    $webhookUrl = $input['roadmap_webhook_url'] ?? '';
    $autoGenerate = isset($input['auto_generate']) ? (int) $input['auto_generate'] : 0;

    // Encrypt API key ideally, but simple storage for now
    // Check if we have existing settings to preserve/update key
    $stmt = $pdo->query("SELECT * FROM ai_settings ORDER BY id DESC LIMIT 1");
    $existing = $stmt->fetch();

    if ($existing && strpos($apiKey, '...') !== false) {
        // It's masked, so keep the old key
        $apiKey = $existing['api_key'];
    }

    // We insert new row for history or update latest?
    // Let's insert new to keep history, simple.
    try {
        $stmt = $pdo->prepare("INSERT INTO ai_settings (provider, model, api_key, roadmap_webhook_url, auto_generate) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$provider, $model, $apiKey, $webhookUrl, $autoGenerate]);

        jsonResponse(['status' => 'success', 'message' => 'Settings saved']);
    } catch (Exception $e) {
        // Self-Heal: Check if error is due to missing column
        if (strpos($e->getMessage(), 'no column named auto_generate') !== false) {
            try {
                $pdo->exec("ALTER TABLE ai_settings ADD COLUMN auto_generate INTEGER DEFAULT 0");
                // Retry Insert
                $stmt = $pdo->prepare("INSERT INTO ai_settings (provider, model, api_key, roadmap_webhook_url, auto_generate) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$provider, $model, $apiKey, $webhookUrl, $autoGenerate]);
                jsonResponse(['status' => 'success', 'message' => 'Settings saved (Database updated automatically)']);
                return;
            } catch (Exception $ex) {
                jsonResponse(['status' => 'error', 'message' => 'Migration failed: ' . $ex->getMessage()], 500);
            }
        }
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
} else {
    jsonResponse(['status' => 'error', 'message' => 'Method not allowed'], 405);
}
?>