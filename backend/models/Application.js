const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        // ===============================
        // JOB APPLIED FOR
        // ===============================

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        // ===============================
        // JOB SEEKER
        // ===============================

        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // ===============================
        // APPLICATION STATUS
        // ===============================

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


// ===============================
// PREVENT DUPLICATE APPLICATIONS
// ===============================

applicationSchema.index(
    {
        job: 1,
        applicant: 1
    },
    {
        unique: true
    }
);


module.exports = mongoose.model(
    "Application",
    applicationSchema
);