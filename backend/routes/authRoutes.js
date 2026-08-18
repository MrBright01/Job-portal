const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();


// =====================================
// SIGN UP
// POST /api/auth/signup
// =====================================

router.post("/signup", async (req, res) => {

    try {

        const { name, email, password, role } = req.body;

        // Check fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        // Check role
        if (!["employee", "employer"].includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }

        // Clean email
        const cleanEmail = email.toLowerCase().trim();

        // Check existing user
        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name: name.trim(),
            email: cleanEmail,
            password: hashedPassword,
            role: role
        });

        await user.save();

        // Send response
        res.status(201).json({
            message: "Signup successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("SIGNUP ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =====================================
// LOGIN
// POST /api/auth/login
// =====================================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Clean email
        const cleanEmail = email.toLowerCase().trim();

        // Find user
        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Login successful
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =====================================
// EXPORT
// =====================================

module.exports = router;