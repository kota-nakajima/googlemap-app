<?php
ini_set('display_errors','0');
ini_set('log_errors','1');
header('Content-Type: application/json; charset=UTF-8');
require 'db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) { http_response_code(400); echo json_encode(['error'=>'invalid json']); exit; }

    $pdo = db();
    // 重複チェック
    $chk = $pdo->prepare('SELECT 1 FROM filters
        WHERE user_id=? AND location=? AND radius=? AND cuisine=? AND
              COALESCE(min_budget,-1)=COALESCE(?, -1) AND
              COALESCE(max_budget,-1)=COALESCE(?, -1) AND
              review_count=? AND rating=?');
    $chk->execute([
        $data['userId'], $data['location'], $data['radius'], $data['cuisine'],
        $data['minBudget']??null, $data['maxBudget']??null,
        $data['reviewCount'], $data['rating']
    ]);
    if ($chk->fetch()) { echo json_encode(['dup'=>true]); exit; }

    $ins = $pdo->prepare('INSERT INTO filters
        (user_id, location, radius, cuisine, min_budget, max_budget, review_count, rating)
        VALUES (?,?,?,?,?,?,?,?)');
    $ins->execute([
        $data['userId'], $data['location'], $data['radius'], $data['cuisine'],
        $data['minBudget']??null, $data['maxBudget']??null,
        $data['reviewCount'], $data['rating']
    ]);
    echo json_encode(['ok'=>true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error'=>$e->getMessage()]);
}
