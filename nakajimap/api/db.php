<?php
// nakajimap/api/db.php

function db(): PDO
{
    // Docker ネットワーク内では "db" が MariaDB コンテナのホスト名
    $host   = 'db';
    $dbname = 'shop_app';
    $user   = 'shopuser';
    $pass   = 'secretpass';
    $dsn    = "mysql:host={$host};dbname={$dbname};charset=utf8mb4";

    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    return new PDO($dsn, $user, $pass, $options);
}
