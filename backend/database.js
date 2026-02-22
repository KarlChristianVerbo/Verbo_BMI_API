const mysql = require("mysql2/promise");

// Database configuration
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "bmi_calculator"
};

// Create connection pool
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Database connected successfully!");
        connection.release();
        return true;
    } catch (error) {
        console.error("Database connection error:", error.message);
        return false;
    }
}

// Initialize database and create table if not exists
async function initializeDatabase() {
    try {
        // First, create database if it doesn't exist
        const tempConnection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });
        
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        await tempConnection.end();
        
        // Now create table
        const connection = await pool.getConnection();
        
        // Check if table exists and get its structure
        const [tables] = await connection.query(`
            SHOW TABLES LIKE 'bmi_records'
        `);
        
        if (tables.length === 0) {
            // Create new table with all columns
            await connection.query(`
                CREATE TABLE bmi_records (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    age INT NOT NULL,
                    gender VARCHAR(20) NOT NULL,
                    height_cm DECIMAL(5,2) NOT NULL,
                    weight_kg DECIMAL(5,2) NOT NULL,
                    bmi_value DECIMAL(4,2) NOT NULL,
                    category VARCHAR(20) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
        } else {
            // Table exists, check and add missing columns
            const [columns] = await connection.query(`
                SHOW COLUMNS FROM bmi_records LIKE 'name'
            `);
            
            if (columns.length === 0) {
                // Add new columns for migration
                await connection.query(`
                    ALTER TABLE bmi_records 
                    ADD COLUMN name VARCHAR(100) NOT NULL DEFAULT 'Unknown' AFTER id,
                    ADD COLUMN age INT NOT NULL DEFAULT 0 AFTER name,
                    ADD COLUMN gender VARCHAR(20) NOT NULL DEFAULT 'Unknown' AFTER age
                `);
            }
        }
        
        connection.release();
        console.log("Database initialized successfully!");
        return true;
    } catch (error) {
        console.error("Database initialization error:", error.message);
        return false;
    }
}

// Save BMI record
async function saveBMIRecord(name, age, gender, height, weight, bmi, category) {
    try {
        const [result] = await pool.query(
            `INSERT INTO bmi_records (name, age, gender, height_cm, weight_kg, bmi_value, category) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, age, gender, height, weight, bmi, category]
        );
        return { success: true, id: result.insertId };
    } catch (error) {
        console.error("Error saving BMI record:", error.message);
        return { success: false, error: error.message };
    }
}

// Get all BMI records
async function getAllBMIRecords() {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM bmi_records ORDER BY created_at DESC`
        );
        return { success: true, records: rows };
    } catch (error) {
        console.error("Error fetching BMI records:", error.message);
        return { success: false, error: error.message };
    }
}

// Get BMI records by name
async function getBMIRecordsByName(name) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM bmi_records WHERE name = ? ORDER BY created_at DESC`,
            [name]
        );
        return { success: true, records: rows };
    } catch (error) {
        console.error("Error fetching BMI records by name:", error.message);
        return { success: false, error: error.message };
    }
}

// Get BMI record by ID
async function getBMIRecordById(id) {
    try {
        const [rows] = await pool.query(
            `SELECT * FROM bmi_records WHERE id = ?`,
            [id]
        );
        return { success: true, record: rows[0] || null };
    } catch (error) {
        console.error("Error fetching BMI record:", error.message);
        return { success: false, error: error.message };
    }
}

module.exports = {
    pool,
    testConnection,
    initializeDatabase,
    saveBMIRecord,
    getAllBMIRecords,
    getBMIRecordById,
    getBMIRecordsByName
};
