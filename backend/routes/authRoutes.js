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
// GET PROFILE
// GET /api/auth/profile/:id
// =====================================

router.get("/profile/:id", async (req, res) => {

    try {

        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {

        console.error("GET PROFILE ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// =====================================
// UPDATE PROFILE
// PUT /api/auth/profile/:id
// =====================================

router.put("/profile/:id", async (req, res) => {

    try {

        const {
            name,
            phone,
            location,
            education,
            skills,
            experience,
            about
        } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Update only provided fields
        if (name !== undefined) {
            user.name = name.trim();
        }

        if (phone !== undefined) {
            user.phone = phone.trim();
        }

        if (location !== undefined) {
            user.location = location.trim();
        }

        if (education !== undefined) {
            user.education = education.trim();
        }

        if (skills !== undefined) {
            user.skills = Array.isArray(skills)
                ? skills
                : [];
        }

        if (experience !== undefined) {
            user.experience = experience.trim();
        }

        if (about !== undefined) {
            user.about = about.trim();
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                location: user.location,
                education: user.education,
                skills: user.skills,
                experience: user.experience,
                about: user.about,
                profilePhoto: user.profilePhoto
            }
        });

    } catch (error) {

        console.error("UPDATE PROFILE ERROR:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});
// =====================================
// EXPORT
// =====================================

module.exports = router;