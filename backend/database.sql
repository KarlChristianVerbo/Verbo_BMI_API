-- BMI Calculator Database Schema
-- Run this script to initialize the database manually if needed

-- Create database
CREATE DATABASE IF NOT EXISTS bmi_calculator;

-- Use the database
USE bmi_calculator;

-- Create BMI records table
CREATE TABLE IF NOT EXISTS bmi_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    height_cm DECIMAL(5,2) NOT NULL,
    weight_kg DECIMAL(5,2) NOT NULL,
    bmi_value DECIMAL(4,2) NOT NULL,
    category VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for faster queries
CREATE INDEX idx_created_at ON bmi_records(created_at);

-- Sample data (optional)
INSERT INTO bmi_records (name, age, gender, height_cm, weight_kg, bmi_value, category) VALUES
('John Doe', 25, 'Male', 175, 70, 22.86, 'NORMAL'),
('Jane Smith', 30, 'Female', 160, 50, 19.53, 'NORMAL'),
('Mike Johnson', 35, 'Male', 180, 90, 27.78, 'OVERWEIGHT'),
('Sarah Williams', 28, 'Female', 170, 55, 19.03, 'NORMAL');
