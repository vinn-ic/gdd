<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");



include 'db.php';
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $idAccount = $_POST['idAccount'] ?? -1;
}


$stmt = $db->prepare("delete from tabela where id = :id");
$stmt->execute([':id' => $idAccount]);
