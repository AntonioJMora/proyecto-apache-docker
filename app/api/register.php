<?php
header('Content-Type: application/json');
require "db.php";

$data     = json_decode(file_get_contents("php://input"), true);
$usuario  = trim($data["usuario"]  ?? "");
$password = trim($data["password"] ?? "");

// Validaciones básicas
if ($usuario === "" || $password === "") {
    echo json_encode(["ok" => false, "msg" => "Campos vacíos"]);
    exit;
}

if (strlen($usuario) < 3) {
    echo json_encode(["ok" => false, "msg" => "El usuario debe tener al menos 3 caracteres"]);
    exit;
}

if (strlen($password) < 4) {
    echo json_encode(["ok" => false, "msg" => "La contraseña debe tener al menos 4 caracteres"]);
    exit;
}

// Comprobar si el usuario ya existe
$check = $conexion->prepare("SELECT id FROM clientes WHERE usuario = ?");
$check->bind_param("s", $usuario);
$check->execute();
$check->get_result()->num_rows > 0
    && exit(json_encode(["ok" => false, "msg" => "Ese nombre de usuario ya está en uso"]));

// Insertar con contraseña hasheada
$stmt = $conexion->prepare(
    "INSERT INTO clientes (usuario, password) VALUES (?, SHA2(?, 256))"
);
$stmt->bind_param("ss", $usuario, $password);

if ($stmt->execute()) {
    echo json_encode(["ok" => true]);
} else {
    echo json_encode(["ok" => false, "msg" => "Error al registrar"]);
}