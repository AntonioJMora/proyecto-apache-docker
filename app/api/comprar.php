<?php
header('Content-Type: application/json');
require "db.php";

$data    = json_decode(file_get_contents("php://input"), true);
$usuario = $data["usuario"] ?? "";
$carrito = $data["carrito"] ?? [];

$stmt = $conexion->prepare("SELECT id FROM clientes WHERE usuario = ?");
$stmt->bind_param("s", $usuario);
$stmt->execute();
$cliente = $stmt->get_result()->fetch_assoc();

if (!$cliente) {
    echo json_encode(["ok" => false, "msg" => "Usuario no encontrado"]);
    exit;
}

$cliente_id = $cliente["id"];

$insert = $conexion->prepare(
    "INSERT INTO compras (cliente_id, producto_id, cantidad) VALUES (?, ?, ?)"
);

foreach ($carrito as $item) {
    $insert->bind_param("iii", $cliente_id, $item["id"], $item["cantidad"]);
    $insert->execute();
}

echo json_encode(["ok" => true]);