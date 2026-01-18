<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

include 'db.php';

$exec = $db->query("SELECT *, DATE_FORMAT(endDate, '%d/%m/%Y') AS endDateFor FROM tabela;");
$dados = [];

while ($table = $exec->fetch(PDO::FETCH_ASSOC)) {
  $dados[] = [
    'name' => $table['name'] ?? '',
    'value' => $table['value'] ?? '',
    'endDate' => $table['endDateFor'] ?? '',
    'obs' => $table['obs'] ?? '',
    'boolPaid' => $table['boolPaid'] ?? '',
    'id' => $table['id'] ?? ''
  ];
}

echo json_encode(['tabela' => $dados]);
