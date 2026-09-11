const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // Basic account information
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["employee", "employer"],
            required: true
        },

        // =========================
        // Job Seeker Profile
        // =========================

        phone: {
            type: String,
            trim: true,
            default: ""
        },

        location: {
            type: String,
            trim: true,
            default: ""
        },

        education: {
            type: String,
            trim: true,
            default: ""
        },

        skills: {
            type: [String],
            default: []
        },

        experience: {
            type: String,
            trim: true,
            default: ""
        },

        about: {
            type: String,
            trim: true,
            default: ""
        },

        profilePhoto: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);