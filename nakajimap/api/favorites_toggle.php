<?php
ini_set('display_errors','0');
ini_set('log_errors','1');
header('Content-Type: application/json; charset=UTF-8');
require 'db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) { http_response_code(400); echo json_encode(['error'=>'invalid json']); exit; }

    // geometry から lat/lng を取り出す（無ければ NULL）
    $lat = $data['geometry']['location']['lat'] ?? null;
    $lng = $data['geometry']['location']['lng'] ?? null;

    $pdo = db();
    $pdo->beginTransaction();

    // 既登録チェック
    $sel = $pdo->prepare('SELECT id FROM favorites WHERE user_id = ? AND place_id = ?');
    $sel->execute([$data['userId'], $data['place_id']]);
    $row = $sel->fetch();

    if ($row) {                          // 既に登録 → 削除
        $pdo->prepare('DELETE FROM favorites WHERE id = ?')->execute([$row['id']]);
        $pdo->commit();
        echo json_encode(['state'=>false]);
        exit;
    }

    // 未登録 → 追加
    $ins = $pdo->prepare('INSERT INTO favorites
        (user_id, place_id, shop, business_status,
         n_review, star, vicinity,
         lat, lng, geometry, bookmark)
        VALUES (?,?,?,?,?,?,?,?,?, ?,1)');
    $ins->execute([
        $data['userId'],
        $data['place_id'],
        $data['shop'],
        $data['business_status'] ?? null,
        $data['n_review'] ?? null,
        $data['star'] ?? null,
        $data['vicinity'] ?? null,
        $lat,
        $lng,
        json_encode($data['geometry'], JSON_UNESCAPED_UNICODE),
    ]);
    $pdo->commit();
    echo json_encode(['state'=>true]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['error'=>$e->getMessage()]);
}
