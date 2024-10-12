-- Initial Data Insertion

-- Insert data into __EFMigrationsHistory table
INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES
    ('20241011054842_UpdateOrderStatusType', '8.0.8'),
    ('20241010054841_InitialCreate', '8.0.7');

-- Insert data into Cars table
INSERT INTO `Cars` (`Id`, `Url`, `user_id`, `car_plate`)
VALUES
    (1, 'https://example.com/car1.jpg', 1, 'ABC123'),
    (2, 'https://example.com/car2.jpg', 2, 'XYZ987'),
    (3, 'https://example.com/car3.jpg', 3, 'LMN456');

-- Insert data into Users table
INSERT INTO `Users` (`Id`, `Username`, `Password`, `Role`, `Email`, `CarId`)
VALUES
    (4, 'a', 'a', 'Admin', 'a@example.com', 1),
    (1, 'john_doe', 'password123', 'Admin', 'john@example.com', 1),
    (2, 'jane_smith', 'password456', 'User', 'jane@example.com', 2),
    (3, 'alice_jones', 'password789', 'User', 'alice@example.com', 3);

-- Insert data into Orders table
INSERT INTO `Orders` (`Id`, `car_id`, `user_id`, `start_time`, `end_time`, `Fee`, `OrderStatus`)
VALUES
    (1, 1, 1, '2024-10-10 12:00:00', '2024-10-10 15:00:00', 100.00, 'Completed'),
    (2, 2, 2, '2024-10-09 08:00:00', '2024-10-09 10:30:00', 50.00, 'Pending'),
    (3, 3, 3, '2024-10-08 14:00:00', '2024-10-08 16:00:00', 75.00, 'Completed');

-- Schema Creation and Migrations

CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) CHARACTER SET=utf8mb4;

START TRANSACTION;

ALTER DATABASE CHARACTER SET utf8mb4;

CREATE TABLE `Cars` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Url` longtext CHARACTER SET utf8mb4 NOT NULL,
    `user_id` int NOT NULL,
    `car_plate` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Cars` PRIMARY KEY (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Users` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Username` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Password` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Role` longtext CHARACTER SET utf8mb4 NOT NULL,
    `Email` longtext CHARACTER SET utf8mb4 NOT NULL,
    `CarId` int NULL,
    CONSTRAINT `PK_Users` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Users_Cars_CarId` FOREIGN KEY (`CarId`) REFERENCES `Cars` (`Id`)
) CHARACTER SET=utf8mb4;

CREATE TABLE `Orders` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `car_id` int NOT NULL,
    `user_id` int NOT NULL,
    `start_time` datetime(6) NOT NULL,
    `end_time` datetime(6) NOT NULL,
    `Fee` decimal(65,30) NOT NULL,
    `OrderStatus` longtext CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK_Orders` PRIMARY KEY (`Id`),
    CONSTRAINT `FK_Orders_Cars_car_id` FOREIGN KEY (`car_id`) REFERENCES `Cars` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_Orders_Users_user_id` FOREIGN KEY (`user_id`) REFERENCES `Users` (`Id`) ON DELETE CASCADE
) CHARACTER SET=utf8mb4;

CREATE INDEX `IX_Orders_car_id` ON `Orders` (`car_id`);

CREATE INDEX `IX_Orders_user_id` ON `Orders` (`user_id`);

CREATE INDEX `IX_Users_CarId` ON `Users` (`CarId`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20241011054842_UpdateOrderStatusType', '8.0.8');

COMMIT;

