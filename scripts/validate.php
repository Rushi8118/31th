<?php
/**
 * Schema-Seed Drift Guard
 * Run: php scripts/validate.php
 */

$schemaPath = "app/supabase/schema.sql";
$seedPath   = "app/supabase/seed.sql";

function extractColumns(string $sql, string $tableName): array {
    $pattern = "/CREATE TABLE\\s+" . preg_quote($tableName, '/') . "\\s*\\((.+?)\\);/is";
    if (!preg_match($pattern, $sql, $matches)) return [];
    
    $body = $matches[1];
    $columns = [];
    $lines = explode("\n", $body);
    
    foreach ($lines as $line) {
        $line = trim($line);
        if (
            str_starts_with($line, '--') ||
            str_starts_with($line, 'CREATE') ||
            str_starts_with($line, ')') ||
            str_starts_with($line, 'UNIQUE') ||
            str_starts_with($line, 'CHECK') ||
            str_starts_with($line, 'PRIMARY') ||
            str_starts_with($line, 'FOREIGN') ||
            str_starts_with($line, 'REFERENCES') ||
            $line === ''
        ) continue;
        
        if (preg_match('/^([a-z_][a-z0-9_]*)\\s+/i', $line, $colMatch)) {
            $columns[] = $colMatch[1];
        }
    }
    return array_unique($columns);
}

function extractSeedColumns(string $sql, string $tableName): array {
    $pattern = "/INSERT INTO\\s+" . preg_quote($tableName, '/') . "\\s*\\(([^)]+)\\)/i";
    preg_match_all($pattern, $sql, $matches);
    $allCols = [];
    foreach ($matches[1] as $match) {
        foreach (explode(',', $match) as $col) {
            $allCols[] = trim($col);
        }
    }
    return array_unique($allCols);
}

$schema = file_get_contents($schemaPath);
$seed   = file_get_contents($seedPath);

$tables = [
    "countries", "visa_programs", "user_profiles", "applications",
    "consultations", "saved_places", "interactions", "blog_posts",
    "notifications", "country_faqs"
];

$errors = 0;

foreach ($tables as $table) {
    $schemaCols = extractColumns($schema, $table);
    $seedCols   = extractSeedColumns($seed, $table);
    
    foreach ($seedCols as $col) {
        if (!in_array($col, $schemaCols)) {
            echo "❌ DRIFT: seed.sql references '{$col}' on '{$table}' which does NOT exist in schema.sql\n";
            $errors++;
        }
    }
}

if ($errors > 0) {
    echo "\n🚫 Failed with {$errors} error(s). Fix before deploying.\n";
    exit(1);
} else {
    echo "✅ schema.sql and seed.sql are synchronized. No drift.\n";
    exit(0);
}