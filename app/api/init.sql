USE basedatos;

-- CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE,
    password VARCHAR(255)
);

INSERT IGNORE INTO clientes (usuario, password) VALUES
('usuario', SHA2('1234', 256)),
('jose',    SHA2('5678', 256));

-- PRODUCTOS
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(20),
    nombre VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10,2),
    imagen TEXT
);

INSERT IGNORE INTO productos (id, tipo, nombre, descripcion, precio, imagen) VALUES
(1, 'CPU','Intel Core i5-12400','6 núcleos 4.4GHz',145,'https://img.pccomponentes.com/articles/83/834921/145-intel-core-i5-12400-44-ghz.jpg'),
(2, 'GPU','RTX 3060','12GB GDDR6',285,'https://img.pccomponentes.com/articles/43/432064/1343-gigabyte-geforce-rtx-3060-gaming-oc-12gb-gddr6-rev-20.jpg'),
(3, 'RAM','Corsair 16GB DDR4','3200 MHz',40,'https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Memory/CMK16GX4M1A2400C16/Gallery/VENG_LPX_BLK_01.webp');

-- COMPRAS
CREATE TABLE IF NOT EXISTS compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    producto_id INT,
    cantidad INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
