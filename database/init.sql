USE basedatos;

CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE,
    password VARCHAR(255)
);

INSERT IGNORE INTO clientes (usuario, password) VALUES
('usuario', SHA2('1234', 256)),
('jose',    SHA2('5678', 256));

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(20),
    nombre VARCHAR(100),
    descripcion TEXT,
    precio DECIMAL(10,2),
    imagen TEXT
);

INSERT IGNORE INTO productos (id, tipo, nombre, descripcion, precio, imagen) VALUES
(1, 'CPU', 'Intel Core i5-12400',  '6 núcleos, 12 hilos, 4.4 GHz',          145, 'https://img.pccomponentes.com/articles/83/834921/145-intel-core-i5-12400-44-ghz.jpg'),
(2, 'CPU', 'AMD Ryzen 5 5600X',    '6 núcleos, 12 hilos, 4.6 GHz',           135, 'https://img.pccomponentes.com/articles/32/328475/1101-amd-ryzen-5-5600x-37ghz.jpg'),
(3, 'GPU', 'RTX 3060',             '12 GB GDDR6, muy buena para gaming',      285, 'https://img.pccomponentes.com/articles/43/432064/1343-gigabyte-geforce-rtx-3060-gaming-oc-12gb-gddr6-rev-20.jpg'),
(4, 'GPU', 'RX 6700 XT',           '12 GB GDDR6, buena relación calidad precio', 340, 'https://m.media-amazon.com/images/I/81L7-qPS0ZL._AC_UF894,1000_QL80_.jpg'),
(5, 'RAM', 'Corsair 16 GB DDR4',   '3200 MHz, kit 2×8 GB',                    40, 'https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Memory/CMK16GX4M1A2400C16/Gallery/VENG_LPX_BLK_01.webp'),
(6, 'RAM', 'Kingston 32 GB DDR4',  '3600 MHz, kit 2×16 GB',                   70, 'https://m.media-amazon.com/images/I/71+clMT-q-L._AC_UF894,1000_QL80_.jpg'),
(7, 'SSD', 'Samsung 970 Evo 1 TB', 'NVMe PCIe, 3500 MB/s lectura',            85, 'https://m.media-amazon.com/images/I/61VlAVm6Q3L._AC_UF894,1000_QL80_.jpg'),
(8, 'SSD', 'WD Blue 500 GB',       'SSD SATA, bueno para empezar',            35, 'https://m.media-amazon.com/images/I/81pU7XNliML.jpg');

CREATE TABLE IF NOT EXISTS compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    producto_id INT,
    cantidad INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);