<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $nameAccount = $_POST['nameAccount'] ?? '';
  $valueAccont = intval($_POST['valueAccount'] ?? 0);
  $endDateAccount = $_POST['endDateAccount'] ?? '';
  $obsAccount = $_POST['obsAccount'] ?? '';
}


$stmt = $db->prepare("insert into tabela (name, value, endDate, obs, boolPaid) values (:n, :v, :e , :o, :b)");
$stmt->execute([':n' => $nameAccount, ':v' => $valueAccont, ':e' => $endDateAccount, ':o' => $obsAccount, ':b' => 0]);
