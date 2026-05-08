<?php
header('Content-Type: application/json');
require "db.php";

$data     = json_decode(file_get_contents("php://input"), true);
$usuario  = trim($data["usuario"]  ?? "");
$password = trim($data["password"] ?? "");

if ($usuario === "" || $password === "") {
    echo json_encode(["ok" => false, "msg" => "Campos vacíos"]);
    exit;
}

// Comparamos contra el hash SHA2-256 almacenado
$stmt = $conexion->prepare(
    "SELECT id FROM clientes WHERE usuario = ? AND password = SHA2(?, 256)"
);
$stmt->bind_param("ss", $usuario, $password);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    echo json_encode(["ok" => true]);
} else {
    echo json_encode(["ok" => false, "msg" => "Credenciales incorrectas"]);
}