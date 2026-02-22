const Express = require("express");
const Cors = require("cors");
const db = require("./database");

const App = Express();

// Middleware
App.use(Cors());
App.use(Express.json());

// Logging middleware for debugging
App.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Initialize database on server start
db.initializeDatabase().then(() => {
    db.testConnection();
});

// Test route
App.get("/students", (req, res) => {
    res.json([
    { id: 1, name: "Juan Dela Cruz", course: "BSIT", year: 2 },
    { id: 2, name: "Maria Clara", course: "BSCS", year: 1 }
    ]);
});

// BMI Calculation function
function calculateBMI(height, weight) {
    // BMI = weight (kg) / (height (m))^2
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return parseFloat(bmi.toFixed(2));
}

// Get BMI category
function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return "UNDERWEIGHT";
    } else if (bmi >= 18.5 && bmi < 25) {
        return "NORMAL";
    } else if (bmi >= 25 && bmi < 30) {
        return "OVERWEIGHT";
    } else {
        return "OBESE";
    }
}

// Calculate BMI endpoint
App.post("/api/bmi/calculate", async (req, res) => {
    try {
        const { name, age, gender, height, weight } = req.body;
        
        // Validate input
        if (!name || !age || !gender) {
            return res.status(400).json({ 
                success: false, 
                error: "Name, age, and gender are required" 
            });
        }
        
        if (!height || !weight || height <= 0 || weight <= 0) {
            return res.status(400).json({ 
                success: false, 
                error: "Height and weight must be positive numbers" 
            });
        }
        
        if (age <= 0 || age > 150) {
            return res.status(400).json({ 
                success: false, 
                error: "Age must be a valid number between 1 and 150" 
            });
        }
        
        // Calculate BMI
        const bmi = calculateBMI(height, weight);
        const category = getBMICategory(bmi);
        
        // Save to database
        const saveResult = await db.saveBMIRecord(name, age, gender, height, weight, bmi, category);
        
        if (!saveResult.success) {
            return res.status(500).json({
                success: false,
                error: "Failed to save BMI record to database: " + (saveResult.error || "Unknown error")
            });
        }
        
        res.json({
            success: true,
            bmi: bmi,
            category: category,
            recordId: saveResult.id,
            message: "BMI calculated and saved successfully"
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Get all BMI records
App.get("/api/bmi/records", async (req, res) => {
    try {
        const result = await db.getAllBMIRecords();
        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Get single BMI record by ID
App.get("/api/bmi/records/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.getBMIRecordById(id);
        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Get BMI records by name (history)
App.get("/api/bmi/history/:name", async (req, res) => {
    try {
        const { name } = req.params;
        // Decode the name parameter (handle URL encoding)
        const decodedName = decodeURIComponent(name);
        console.log("History endpoint called - Raw name:", name);
        console.log("History endpoint called - Decoded name:", decodedName);
        
        const result = await db.getBMIRecordsByName(decodedName);
        console.log("Database result:", result);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error("Error in history endpoint:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Debug route to test if API routes are working
App.get("/api/test", (req, res) => {
    res.json({ message: "API routes are working!", timestamp: new Date().toISOString() });
});

// Serve static files AFTER API routes (important!)
App.use(Express.static("public"));

// Start server
App.listen(3000, () => {
    console.log("Server running on port 3000");
});