<?php
require 'db.php';
header('Content-Type:application/json; charset=UTF-8');

$id = $_GET['id'] ?? '';
if ($id==='') { http_response_code(400); exit; }

db()->prepare('DELETE FROM filters WHERE id=?')->execute([$id]);
echo json_encode(['deleted'=>true]);
