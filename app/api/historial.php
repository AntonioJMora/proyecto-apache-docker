<?php
ini_set('display_errors', 0);
error_reporting(0);
header('Content-Type: application/json');
require "db.php";

$raw  = file_get_contents("php://input");
$data = json_decode($raw, true);

$usuario = trim($data["usuario"] ?? "");

if ($usuario === "") {
    echo json_encode(["ok" => false, "msg" => "Usuario no indicado"]);
    exit;
}

$stmt = $conexion->prepare("
    SELECT p.nombre, p.tipo, p.precio, c.cantidad, c.fecha
    FROM compras c
    JOIN clientes cl ON c.cliente_id = cl.id
    JOIN productos p  ON c.producto_id = p.id
    WHERE cl.usuario = ?
    ORDER BY c.fecha DESC
");
$stmt->bind_param("s", $usuario);
$stmt->execute();
$resultado = $stmt->get_result();

$compras = [];
while ($fila = $resultado->fetch_assoc()) {
    $compras[] = $fila;
}

echo json_encode(["ok" => true, "compras" => $compras]);