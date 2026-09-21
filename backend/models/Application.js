const mongoose = require("mongoose");


// =========================================
// APPLICATION SCHEMA
// =========================================

const applicationSchema = new mongoose.Schema(
    {
        // Job applied for
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        // Job seeker
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // Resume submitted with this application
        resume: {
            fileName: {
                type: String,
                required: true
            },

            fileUrl: {
                type: String,
                required: true
            },

            uploadedAt: {
                type: Date,
                default: Date.now
            }
        },

        // Application status
        status: {
            type: String,
            enum: [
                "Applied",
                "Shortlisted",
                "Accepted",
                "Rejected"
            ],
            default: "Applied"
        }
    },

    {
        timestamps: true
    }
);


// =========================================
// PREVENT DUPLICATE APPLICATIONS
// =========================================

applicationSchema.index(
    {
        job: 1,
        applicant: 1
    },
    {
        unique: true
    }
);


// =========================================
// EXPORT MODEL
// =========================================

module.exports =
    mongoose.model(
        "Application",
        applicationSchema
    );