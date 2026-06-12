<?php
// backend/debug.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>system diagnostic</h1>";

echo "<h2>1. environment</h2>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Server Software: " . $_SERVER['SERVER_SOFTWARE'] . "<br>";
echo "Document Root: " . $_SERVER['DOCUMENT_ROOT'] . "<br>";

echo "<h2>2. file permissions</h2>";
$dir = __DIR__;
$dbFile = $dir . '/database.sqlite';

echo "Backend Directory: " . $dir . "<br>";
echo "Is Directory Writable? " . (is_writable($dir) ? '<span style="color:green">YES</span>' : '<span style="color:red">NO - Please chmod 775 or 777</span>') . "<br>";

if (file_exists($dbFile)) {
    echo "Database File Exists.<br>";
    echo "Is DB Writable? " . (is_writable($dbFile) ? '<span style="color:green">YES</span>' : '<span style="color:red">NO</span>') . "<br>";
} else {
    echo "Database File DOES NOT Exist (Will try to create).<br>";
}

echo "<h2>3. database connection</h2>";
try {
    $pdo = new PDO("sqlite:" . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "<span style='color:green'>PDO Connection Successful</span><br>";

    // Try creating table
    $pdo->exec("CREATE TABLE IF NOT EXISTS debug_test (id INTEGER PRIMARY KEY, created_at DATETIME)");
    echo "Table Creation Test: Success<br>";

    // Try inserting
    $pdo->exec("INSERT INTO debug_test (created_at) VALUES (CURRENT_TIMESTAMP)");
    echo "Insert Test: Success<br>";

    // Check leads count
    $stmt = $pdo->query("SELECT COUNT(*) FROM leads");
    if ($stmt) {
        $count = $stmt->fetchColumn();
        echo "Current Leads Count in DB: <strong>$count</strong><br>";
    } else {
        echo "Leads table might not exist yet.<br>";
    }

} catch (Exception $e) {
    echo "<span style='color:red'>Database Error: " . $e->getMessage() . "</span><br>";
}
?>