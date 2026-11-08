const bcrypt = require("bcryptjs");
const {
    createUser,
    findUserByEmail,
    findUserById
} = require("../models/User");

// =========================
// REGISTER USER
// =========================

const registerUser = (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            address
        } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Check if email already exists
        const existingUser = findUserByEmail.get(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create user
        const result = createUser.run(
            name,
            email,
            hashedPassword,
            phone || null,
            address || null,
            "customer"
        );

        const user = findUserById.get(result.lastInsertRowid);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        });

    } catch (error) {
        console.error("Register error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


// =========================
// LOGIN USER
// =========================

const loginUser = (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const user = findUserByEmail.get(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const passwordMatch = bcrypt.compareSync(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Remove password before sending response
        delete user.password;

        res.json({
            success: true,
            message: "Login successful",
            user
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



const loginAdmin = (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = findUserByEmail.get(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin email or password"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access denied"
            });
        }

        const passwordMatch =
            bcrypt.compareSync(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin email or password"
            });
        }

        delete user.password;

        res.json({
            success: true,
            message: "Admin login successful",
            user
        });

    } catch (error) {
        console.error("Admin login error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    loginAdmin
};

