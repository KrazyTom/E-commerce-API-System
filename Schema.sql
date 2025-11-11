CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NOT NULL,
  `email` varchar(100) DEFAULT NOT NULL,
  `password` varchar(255) DEFAULT NOT NULL,
  `role` enum('admin','customer') DEFAULT 'customer',
  `is_deleted` tinyint DEFAULT 0,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);


CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  is_deleted TINYINT DEFAULT 0
);


CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stockQuantity INT DEFAULT 0,
  categoryId INT,
  is_deleted TINYINT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedBy varchar(100),
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id)
  FOREIGN KEY (updatedBy) REFERENCES users(id)
);

-- Trigger for the Categories table to prevent deletion if products exist
DELIMITER $$

CREATE TRIGGER trg_category_soft_delete
AFTER UPDATE ON categories
FOR EACH ROW
BEGIN
  IF NEW.is_deleted = 1 AND OLD.is_deleted = 0 THEN
    UPDATE products
    SET is_deleted = 1
    WHERE categoryId = NEW.id;
  END IF;
END $$
DELIMITER ;