const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// --- MySQL Connection Configuration ---
const dbConfig = {
    host: 'localhost',
    user: 'root',      // Default XAMPP user
    password: '',      // Default XAMPP password is empty
    database: 'gearguard',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Test Database Connection on Startup
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ MySQL Connected Successfully to 'gearguard' database");
        connection.release();
    } catch (err) {
        console.error("❌ MySQL Connection Failed:", err.message);
        console.error("   -> Make sure XAMPP MySQL is running.");
        console.error("   -> Make sure you created the 'gearguard' database.");
    }
})();

// --- ROUTES ---

// 1. SIGNUP
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide both email and password." });
    }

    try {
        // Validation regex (Matches frontend requirements)
        // At least 9 characters, 1 uppercase, 1 lowercase, 1 special char
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{9,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Password must be > 8 chars, contain 1 uppercase, 1 lowercase, and 1 special character." 
            });
        }

        // Check if Email exists
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert User
        const sql = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
        await pool.query(sql, [email, hashedPassword, 'portal user']);

        console.log(`🆕 New user registered: ${email}`);
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error during signup." });
    }
});

// 2. LOGIN
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please enter email and password." });
    }

    try {
        // Check credentials
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Account not registered." });
        }

        const user = rows[0];

        // Match Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password." });
        }

        console.log(`Hz User logged in: ${email}`);
        // Login Success
        res.status(200).json({ message: "Login Successful", role: user.role });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n🚀 GearGuard Server running on http://localhost:${PORT}`);
    console.log("   -> Keep this terminal open for login/signup to work!\n");
});