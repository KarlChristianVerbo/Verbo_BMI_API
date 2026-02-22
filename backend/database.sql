-- Create database
CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    course VARCHAR(100) NOT NULL,
    idNumber VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(100) NOT NULL,
    currentUnits DECIMAL(5, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data (optional)
-- Using INSERT IGNORE to prevent errors if data already exists
INSERT IGNORE INTO students (fullName, course, idNumber, department, currentUnits) VALUES
('Karl Verbo', 'BSIT', '2024-001', 'IT', 18.0),
('Jerard Lavilla', 'BSCS', '2024-002', 'IT', 21.0),
('John Mark', 'BSIT', '2024-003', 'IT', 19.0);
