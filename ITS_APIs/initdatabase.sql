-- create dabsebase
CREATE DATABASE IF NOT EXISTS itsbd;
USE itsbd;

-- create role table
CREATE TABLE Roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name ENUM ('admin', 'user') NOT NULL
);

-- create User table
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    INDEX (username),
    FOREIGN KEY (role_id) REFERENCES Roles(id),
    email VARCHAR(255) NOT NULL UNIQUE
);

-- create Car table
CREATE TABLE Cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(1000),
    user_id INT NOT NULL,
    car_plate VARCHAR(255) NOT NULL,
    INDEX (car_plate),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);



CREATE TABLE ParkingLocations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(255) NOT NULL, -- Location name
    INDEX (location_name),
    address VARCHAR(255) NOT NULL, -- Location address
    capacity INT NOT NULL, -- Number of parking spaces
    available_spaces INT NOT NULL -- Number of currently available spaces
);


-- create Order table
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    user_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    INDEX (start_time), -- Add index for efficient time-based queries
    INDEX (end_time),
    fee DECIMAL(10,2) NOT NULL,
    parking_location_id INT NOT NULL,
    status ENUM ('Confirm', 'Done', 'Cancel', 'Pending') NOT NULL,
    FOREIGN KEY (car_id) REFERENCES Cars(id) ON DELETE CASCADE, -- Delete orders if the car is deleted
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE, -- Delete orders if the user is deleted
    FOREIGN KEY (parking_location_id) REFERENCES ParkingLocations(id) ON DELETE CASCADE
);
