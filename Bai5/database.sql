CREATE DATABASE sequelize_demo_dev;
USE sequelize_demo_dev;
CREATE TABLE Categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    createdAt DATETIME,
    updatedAt DATETIME
);
CREATE TABLE Products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    categoryId INT,
    FOREIGN KEY (categoryId) REFERENCES Categories(id),
    createdAt DATETIME,
    updatedAt DATETIME
);
INSERT INTO Categories (name, description, createdAt, updatedAt) VALUES
    ('Điện tử', 'Các thiết bị điện tử', NOW(), NOW()),
    ('Sách', 'Các loại sách', NOW(), NOW());
INSERT INTO Products (name, description, price, categoryId, createdAt, updatedAt) VALUES
    ('Laptop', 'Laptop hiệu năng cao', 1200.00, 1, NOW(), NOW()),
    ('Điện thoại', 'Điện thoại thông minh mới nhất', 800.00, 1, NOW(), NOW()),
    ('Chúa tể của những chiếc nhẫn', 'Tiểu thuyết giả tưởng', 25.00, 2, NOW(), NOW());
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    createdAt DATETIME,
    updatedAt DATETIME
);
CREATE TABLE Profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    bio TEXT,
    userId INT UNIQUE NOT NULL, -- Khóa ngoại và đảm bảo One-to-One (UNIQUE)
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE, -- Khóa ngoại tham chiếu Users.id, ON DELETE CASCADE để xóa profile khi user bị xóa
    createdAt DATETIME,
    updatedAt DATETIME
);
INSERT INTO Users (username, email, createdAt, updatedAt) VALUES
    ('john_doe', 'john.doe@example.com', NOW(), NOW()),
    ('jane_smith', 'jane.smith@example.com', NOW(), NOW());
INSERT INTO Profiles (firstName, lastName, bio, userId, createdAt, updatedAt) VALUES
    ('John', 'Doe', 'A software engineer passionate about web development.', 1, NOW(), NOW()), -- userId = 1 (John Doe)
    ('Jane', 'Smith', 'A data scientist interested in machine learning and AI.', 2, NOW(), NOW()); -- userId = 2 (Jane Smith)
CREATE TABLE Tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- Slug (URL-friendly name)
    createdAt DATETIME,
    updatedAt DATETIME
);
CREATE TABLE ProductTags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    productId INT,
    tagId INT,
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE, -- Khóa ngoại tham chiếu Products.id, ON DELETE CASCADE
    FOREIGN KEY (tagId) REFERENCES Tags(id) ON DELETE CASCADE, -- Khóa ngoại tham chiếu Tags.id, ON DELETE CASCADE
    createdAt DATETIME,
    updatedAt DATETIME,
    UNIQUE INDEX productTagIndex (productId, tagId) -- Đảm bảo cặp productId, tagId là duy nhất (một product chỉ có một lần một tag)
);
INSERT INTO Tags (name, slug, createdAt, updatedAt) VALUES
    ('Điện tử', 'dien-tu', NOW(), NOW()),
    ('Laptop', 'laptop', NOW(), NOW()),
    ('Gaming', 'gaming', NOW(), NOW()),
    ('Sách', 'sach', NOW(), NOW()),
    ('Tiểu thuyết', 'tieu-thuyet', NOW(), NOW());
INSERT INTO ProductTags (productId, tagId, createdAt, updatedAt) VALUES
    (1, 2, NOW(), NOW()), -- Product "Laptop" (id=1) có tag "Laptop" (tagId=2)
    (1, 3, NOW(), NOW()), -- Product "Laptop" (id=1) có tag "Gaming" (tagId=3)
    (2, 1, NOW(), NOW()), -- Product "Điện thoại" (id=2) có tag "Điện tử" (tagId=1)
    (3, 4, NOW(), NOW()), -- Product "Chúa tể của những chiếc nhẫn" (id=3) có tag "Sách" (tagId=4)
    (3, 5, NOW(), NOW()); -- Product "Chúa tể của những chiếc nhẫn" (id=3) có tag "Tiểu thuyết" (tagId=5)
