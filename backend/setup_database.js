const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Database configuration (same as db.js)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // No password
    multipleStatements: true // Allow multiple SQL statements
});

console.log('🔧 Setting up Student Management Database...\n');

// Read the SQL file
const sqlFile = path.join(__dirname, 'database.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// Execute the SQL script
connection.query(sql, (err, results) => {
    if (err) {
        // Check if it's a duplicate key error (data already exists)
        if (err.code === 'ER_DUP_ENTRY' || err.message.includes('Duplicate entry')) {
            console.log('ℹ️  Database and table already exist.');
            console.log('ℹ️  Sample data may already be present (this is okay).');
            console.log('\n✅ Database is ready to use!');
            console.log('   You can now start the server with: node server.js\n');
            connection.end();
            return;
        }
        
        console.error('❌ Error setting up database:', err.message);
        console.error('\n📝 Please check:');
        console.error('   1. MySQL service is running');
        console.error('   2. MySQL is installed');
        console.error('   3. Username "root" is correct');
        connection.end();
        process.exit(1);
    }
    
    console.log('✅ Database "student_management" created successfully!');
    console.log('✅ Table "students" created successfully!');
    
    // Check if data was inserted
    if (Array.isArray(results) && results.length > 2) {
        const insertResult = results[2]; // INSERT statement result
        if (insertResult && insertResult.affectedRows > 0) {
            console.log(`✅ Sample data inserted successfully! (${insertResult.affectedRows} records)`);
        } else {
            console.log('ℹ️  Sample data already exists (skipped duplicates).');
        }
    }
    
    console.log('\n📊 Database setup completed!');
    console.log('   You can now start the server with: node server.js\n');
    
    connection.end();
});
