const express = require("express");
const Job = require("../models/Job");

const router = express.Router();

// Get all jobs
router.get("/", async (req, res) => {
    try {
        const jobs = await Job.find();

        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch jobs",
            error: error.message
        });
    }
});

// Create a new job
router.post("/", async (req, res) => {
    try {
        const job = new Job(req.body);

        const savedJob = await job.save();

        res.status(201).json(savedJob);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create job",
            error: error.message
        });
    }
});

module.exports = router;