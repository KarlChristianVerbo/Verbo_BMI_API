const Express = require("express");
const Cors = require("cors");
const db = require("./db");

const App = Express();

// Middleware
App.use(Cors());
App.use(Express.json());

// Health check endpoint
App.get("/", (req, res) => {
    res.json({ 
        message: "Student Management API is running",
        status: "ok",
        endpoints: {
            students: "/students"
        }
    });
});

// GET all students
App.get("/students", (req, res) => {
    console.log("Fetching students...");
    const query = "SELECT * FROM students ORDER BY id DESC";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching students:", err);
            return res.status(500).json({ 
                error: "Failed to fetch students",
                details: err.message 
            });
        }
        console.log(`Found ${results.length} students`);
        res.json(results);
    });
});

// GET single student by ID
App.get("/students/:id", (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM students WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error fetching student:", err);
            return res.status(500).json({ error: "Failed to fetch student" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json(results[0]);
    });
});

// POST create new student
App.post("/students", (req, res) => {
    const { fullName, course, idNumber, department, currentUnits } = req.body;
    
    // Validation
    if (!fullName || !course || !idNumber || !department || currentUnits === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = "INSERT INTO students (fullName, course, idNumber, department, currentUnits) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [fullName, course, idNumber, department, currentUnits], (err, results) => {
        if (err) {
            console.error("Error creating student:", err);
            return res.status(500).json({ error: "Failed to create student" });
        }
        // Return the created student
        const newStudent = {
            id: results.insertId,
            fullName,
            course,
            idNumber,
            department,
            currentUnits
        };
        res.status(201).json(newStudent);
    });
});

// PUT update student
App.put("/students/:id", (req, res) => {
    const { id } = req.params;
    const { fullName, course, idNumber, department, currentUnits } = req.body;
    
    // Validation
    if (!fullName || !course || !idNumber || !department || currentUnits === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = "UPDATE students SET fullName = ?, course = ?, idNumber = ?, department = ?, currentUnits = ? WHERE id = ?";
    db.query(query, [fullName, course, idNumber, department, currentUnits, id], (err, results) => {
        if (err) {
            console.error("Error updating student:", err);
            return res.status(500).json({ error: "Failed to update student" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Student not found" });
        }
        // Return the updated student
        const updatedStudent = {
            id: parseInt(id),
            fullName,
            course,
            idNumber,
            department,
            currentUnits
        };
        res.json(updatedStudent);
    });
});

// DELETE student
App.delete("/students/:id", (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM students WHERE id = ?";
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error deleting student:", err);
            return res.status(500).json({ error: "Failed to delete student" });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json({ message: "Student deleted successfully" });
    });
});

// Start server on port 3001
const PORT = 3001;
App.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}`);
});
