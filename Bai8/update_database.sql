use sequelize_demo_dev;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
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