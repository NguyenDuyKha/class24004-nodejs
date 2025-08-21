-- Tạo Database
CREATE DATABASE IF NOT EXISTS express_auth_demo;
-- Sử dụng Database vừa tạo
USE express_auth_demo;
-- Tạo bảng users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,-- Trong thực tế LUÔN LUÔN hash password
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Chèn dữ liệu mẫu (Password chưa hash để demo đơn giản)
-- LƯU Ý: TRONG DỰ ÁN THỰC TẾ PHẢI HASH PASSWORD!!!
INSERT INTO users (username, password, email) VALUES
('testuser', 'password123', 'test@example.com'),
('admin', 'adminpass', 'admin@example.com');
-- Kiểm tra dữ liệu
SELECT * FROM users;

-- Sử dụng Database đã tạo
USE express_auth_demo;
-- Tạo bảng sessions cho express-mysql-session
-- Cấu trúc bảng được khuyến nghị bởi express-mysql-session
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(128) COLLATE utf8mb4_bin NOT NULL PRIMARY KEY,
    expires INT(11) UNSIGNED NOT NULL,
    data MEDIUMTEXT COLLATE utf8mb4_bin
);
-- Có thể thêm index cho cột expires để cải thiện hiệu suất dọn dẹp session hết hạn
-- CREATE INDEX expires ON sessions (expires);-- Tùy chọn