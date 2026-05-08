<?php
ini_set('display_errors', 0);
error_reporting(0);

$conexion = new mysqli(
    "db",       
    "usuario",
    "password",
    "basedatos"
);

if ($conexion->connect_error) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(["ok" => false, "msg" => "Error de conexión con la base de datos"]);
    exit;
}