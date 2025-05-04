<?php
require 'db.php';
header('Content-Type:application/json; charset=UTF-8');

$user  = $_GET['user_id']  ?? '';
$loc   = $_GET['location'] ?? '';
$radius= $_GET['radius']   ?? '';
$cui   = $_GET['cuisine']  ?? '';
$rev   = $_GET['reviewCount'] ?? '';
$rate  = $_GET['rating']   ?? '';
$min   = $_GET['minBudget'] ?? '';
$max   = $_GET['maxBudget'] ?? '';

$sql = 'SELECT * FROM filters WHERE user_id=?';
$params = [$user];

foreach ([
  ['location',$loc],
  ['radius',$radius],
  ['cuisine',$cui],
  ['reviewCount',$rev],
  ['rating',$rate],
] as [$col,$val]) {
  if ($val!=='') { $sql.=" AND $col=?"; $params[]=$val; }
}
if ($min!=='') { $sql.=' AND minBudget=?'; $params[]=$min; }
if ($max!=='') { $sql.=' AND maxBudget=?'; $params[]=$max; }

$stmt=db()->prepare($sql);
$stmt->execute($params);

$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (count($rows) === 0) {
  echo json_encode([]); 
  exit;
}

echo json_encode($rows);
?>