<?php
header("Access-Control-Allow-Origin: *");



include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  $idAccount = intval($_POST['idAccount'] ?? 0);
  $boolPaid = $_POST['boolPaid'] ?? -1;
  $newName = $_POST['nameAccount'] ?? '';
  $newValue = $_POST['valueAccount'] ?? 0;
  $newEndData = $_POST['endDateAccount'] ?? '';
  $newObsAccount = $_POST['obsAccount'] ?? '';
}

if (!empty($idAccount)) {
  $varChange = [];
  $params = [":i" => $idAccount];
  if ($boolPaid == 0 || $boolPaid == 1) {
    $boolPaidForChange = $boolPaid ? 0 : 1;
    $varChange[] = 'boolPaid = :b';
    $params[':b'] = intval($boolPaidForChange);
  }
  if (!empty($newName)) {
    $varChange[] = 'name = :n';
    $params[':n'] = $newName;
  }
  if (!empty($newValue)) {
    $varChange[] = 'value = :v';
    $params[':v'] = intval($newValue);
  }
  if (!empty($newEndData)) {
    $varChange[] = 'endDate = :e';
    $params[':e'] = $newEndData;
  }
  if (!empty($newObsAccount)) {
    $varChange[] = 'obs = :o';
    $params[':o'] = $newObsAccount;
  }
}
$sql = "update tabela set " . implode(",", $varChange) . " where id = :i";

$stmt = $db->prepare($sql);
$stmt->execute($params);

exit;
