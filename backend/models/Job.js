const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        company: {
            type: String,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        salary: {
            type: String
        },

        description: {
            type: String,
            required: true
        },

        skills: {
            type: [String],
            required: true
        },

        jobType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship", "Contract"],
            default: "Full-time"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);