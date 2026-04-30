-- Clara's Best: Pinoy Kakanin Delicacies Database Schema
-- Run this SQL script to initialize your Aiven MySQL database

CREATE DATABASE IF NOT EXISTS claras_best_kakanin;
USE claras_best_kakanin;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Kakanin Menu Table
CREATE TABLE IF NOT EXISTS kakanin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image VARCHAR(255),
  category VARCHAR(50) NOT NULL,
  stock INT DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ingredient_name VARCHAR(100) NOT NULL,
  quantity DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  min_stock DECIMAL(10, 2) NOT NULL,
  supplier VARCHAR(100),
  last_restocked DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20),
  customer_address TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method ENUM('cash', 'gcash', 'maya') NOT NULL,
  payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  order_status ENUM('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
  reservation_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  kakanin_id INT NOT NULL,
  kakanin_name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (kakanin_id) REFERENCES kakanin(id)
);

-- Insert default admin user (password: admin - hashed with bcrypt)
-- In production, use bcrypt to hash passwords
INSERT IGNORE INTO users (id, username, password_hash, full_name, email, role, phone, address) VALUES
(1, 'admin', '$2b$10$YourHashedPasswordHere', 'Clara Santos', 'admin@clarasbest.com', 'admin', '09171234567', '123 Mabini St, Manila'),
(2, 'juan', '$2b$10$YourHashedPasswordHere', 'Juan Dela Cruz', 'juan@email.com', 'customer', '09189876543', '456 Rizal Ave, Quezon City'),
(3, 'maria', '$2b$10$YourHashedPasswordHere', 'Maria Clara', 'maria@email.com', 'customer', '09195551234', '789 Bonifacio St, Makati');

-- Insert sample kakanin items
INSERT IGNORE INTO kakanin (id, name, description, price, category, stock, is_available) VALUES
(1, 'Bibingka', 'Traditional rice cake cooked in clay pots with banana leaves, topped with salted egg and cheese.', 85.00, 'Rice Cakes', 50, TRUE),
(2, 'Puto', 'Steamed rice muffins that are soft, fluffy, and slightly sweet. Perfect with dinuguan.', 45.00, 'Rice Cakes', 100, TRUE),
(3, 'Kutsinta', 'Chewy steamed rice cakes with a distinctive dark brown color, topped with grated coconut.', 50.00, 'Rice Cakes', 80, TRUE),
(4, 'Sapin-Sapin', 'Layered glutinous rice cake with vibrant colors and flavors - ube, langka, and coconut.', 120.00, 'Layered Cakes', 40, TRUE),
(5, 'Biko', 'Sticky rice cake cooked in coconut milk and brown sugar, topped with latik (coconut curds).', 95.00, 'Sticky Rice', 60, TRUE),
(6, 'Suman', 'Steamed glutinous rice wrapped in banana leaves, served with sugar or chocolate.', 40.00, 'Wrapped Rice', 90, TRUE),
(7, 'Maja Blanca', 'Creamy coconut milk pudding with corn kernels, topped with toasted coconut.', 75.00, 'Puddings', 55, TRUE),
(8, 'Cassava Cake', 'Rich and creamy cassava cake baked with coconut milk and topped with cheese.', 110.00, 'Root Cakes', 45, TRUE),
(9, 'Pichi-Pichi', 'Soft and chewy cassava balls coated with grated coconut or cheese.', 55.00, 'Root Cakes', 70, TRUE),
(10, 'Kalamay', 'Sweet sticky rice dessert with coconut milk, latik, and muscovado sugar.', 100.00, 'Sticky Rice', 35, TRUE),
(11, 'Tikoy', 'Chinese-Filipino rice cake traditionally eaten during Lunar New Year celebrations.', 150.00, 'Specialty', 30, TRUE),
(12, 'Espasol', 'Cylinder-shaped rice cake made from toasted rice flour cooked in coconut milk.', 65.00, 'Rice Cakes', 65, TRUE);

-- Insert sample inventory
INSERT IGNORE INTO inventory (id, ingredient_name, quantity, unit, min_stock, supplier, last_restocked) VALUES
(1, 'Glutinous Rice', 50, 'kg', 10, 'Manila Rice Trading', '2025-04-25'),
(2, 'Coconut Milk', 30, 'L', 5, 'Coco Fresh Suppliers', '2025-04-26'),
(3, 'Brown Sugar', 25, 'kg', 5, 'Sweet Source Co.', '2025-04-24'),
(4, 'Grated Coconut', 20, 'kg', 3, 'Coco Fresh Suppliers', '2025-04-26'),
(5, 'Cassava', 40, 'kg', 8, 'Root Crop Farms', '2025-04-27'),
(6, 'Ube (Purple Yam)', 15, 'kg', 3, 'Root Crop Farms', '2025-04-27'),
(7, 'Salted Egg', 100, 'pcs', 20, 'Eggcellent Farms', '2025-04-28'),
(8, 'Cheese', 10, 'kg', 2, 'Dairy Best', '2025-04-28'),
(9, 'Corn Kernels', 12, 'kg', 2, 'Golden Harvest', '2025-04-25'),
(10, 'Banana Leaves', 200, 'pcs', 50, 'Leafy Greens', '2025-04-29');
