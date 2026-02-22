const mysql = require('mysql2');

// Database configuration
// IMPORTANT: Update these values to match your MySQL setup
const db = mysql.createConnection({
    host: 'localhost',                    // Usually 'localhost' or '127.0.0.1'
    user: 'root',                         // Your MySQL username (usually 'root')
    password: '',                         // Leave empty if no password is set
    database: 'student_management'        // Database name
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.message);
        console.error('\n📝 Please check:');
        console.error('   1. MySQL service is running');
        console.error('   2. Username in db.js is correct');
        console.error('   3. Database "student_management" exists');
        console.error('   4. Run: Get-Content database.sql | mysql -u root\n');
        process.exit(1); // Exit if database connection fails
    }
    console.log('✅ Connected to MySQL database');
    console.log('📊 Database: student_management');
});

// Handle connection errors
db.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.');
    } else if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.');
    } else {
        console.error('Database error:', err);
    }
});

module.exports = db;
