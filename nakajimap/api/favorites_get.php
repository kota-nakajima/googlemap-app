<?php
require 'db.php';
header('Content-Type:application/json');
$uid=$_GET['user_id']??'';
$stmt=db()->prepare('SELECT * FROM favorites WHERE user_id=?');
$stmt->execute([$uid]);
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
