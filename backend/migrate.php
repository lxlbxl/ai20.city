<?php
// backend/migrate.php
require_once 'config.php';

echo "Starting Database Migration...<br>";

try {
    // 1. Leads Table Updates
    $columns = $pdo->query("PRAGMA table_info(leads)")->fetchAll(PDO::FETCH_COLUMN, 1);

    if (!in_array('roadmap_status', $columns)) {
        $pdo->exec("ALTER TABLE leads ADD COLUMN roadmap_status TEXT DEFAULT 'pending'");
        echo "Added 'roadmap_status' to leads.<br>";
    }

    if (!in_array('roadmap_content', $columns)) {
        $pdo->exec("ALTER TABLE leads ADD COLUMN roadmap_content TEXT");
        echo "Added 'roadmap_content' to leads.<br>";
    }

    // 2. AI Settings Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS ai_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider TEXT DEFAULT 'openrouter',
        model TEXT DEFAULT 'liquid/lfm-40b:free',
        api_key TEXT,
        roadmap_webhook_url TEXT,
        auto_generate INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $aiColumns = $pdo->query("PRAGMA table_info(ai_settings)")->fetchAll(PDO::FETCH_COLUMN, 1);

    if (!in_array('auto_generate', $aiColumns)) {
        $pdo->exec("ALTER TABLE ai_settings ADD COLUMN auto_generate INTEGER DEFAULT 0");
        echo "Added 'auto_generate' to ai_settings.<br>";
    }

    echo "<br><strong>Migration Completed Successfully!</strong>";

} catch (Exception $e) {
    echo "<br><strong>Error:</strong> " . $e->getMessage();
}
?>