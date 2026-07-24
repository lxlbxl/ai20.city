<?php
// backend/config.php

// Error handling for development
// Error handling for production (Suppress HTML warnings)
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(0);

// CORS Config
if (php_sapi_name() !== 'cli') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

// Database Connection
$dbPath = __DIR__ . '/database.sqlite';

try {
    $pdo = new PDO("sqlite:" . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Initialize Database Tables
    $pdo->exec("CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        phone TEXT,
        company TEXT,
        industry TEXT,
        location TEXT,
        company_size TEXT,
        challenges TEXT,
        ai_usage TEXT,
        timeline TEXT,
        budget TEXT,
        consent INTEGER DEFAULT 0,
        status TEXT DEFAULT 'new',
        notes TEXT,
        product_interest TEXT,
        roadmap_status TEXT DEFAULT 'pending',
        roadmap_content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER,
        name TEXT,
        status TEXT DEFAULT 'active',
        product TEXT,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(client_id) REFERENCES leads(id)
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS ai_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider TEXT DEFAULT 'openrouter',
        model TEXT,
        api_key TEXT,
        roadmap_webhook_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // Seed default admin if empty
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    if ($stmt->fetchColumn() == 0) {
        $defaultPass = password_hash('admin123', PASSWORD_DEFAULT);
        $insert = $pdo->prepare("INSERT INTO users (username, password) VALUES ('admin', ?)");
        $insert->execute([$defaultPass]);
    }

} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    exit();
}

function jsonResponse($data, $status = 200)
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}
?>