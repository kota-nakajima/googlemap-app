<?php
function db(): PDO
{
    $host = getenv('DB_HOST') ?: 'localhost'; 
    $dbname = getenv('DB_NAME') ?: 'shop_app';
    $user = getenv('DB_USER') ?: 'nakajimap_app';
    $pass = getenv('DB_PASS') ?: 'secretpass';
    $dsn  = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";

    return new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}