const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

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


// Prevent duplicate applications
applicationSchema.index(
    {
        job: 1,
        applicant: 1
    },

    {
        unique: true
    }
);


module.exports =
    mongoose.model(
        "Application",
        applicationSchema
    );