const express = require("express");
const Job = require("../models/Job");
const User = require("../models/User");

const router = express.Router();


// ===============================
// GET ALL JOBS
// ===============================
router.get("/", async (req, res) => {

    try {

        const jobs = await Job.find()
            .populate("postedBy", "name email");

        res.status(200).json(jobs);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch jobs",
            error: error.message
        });

    }

});


// ===============================
// CREATE A NEW JOB
// ===============================
router.post("/", async (req, res) => {

    try {

        const {
            title,
            company,
            location,
            salary,
            description,
            skills,
            jobType,
            postedBy
        } = req.body;


        // CHECK REQUIRED EMPLOYER ID
        if (!postedBy) {

            return res.status(400).json({
                message: "Employer ID is required"
            });

        }


        // FIND EMPLOYER
        const employer =
            await User.findById(postedBy);


        if (!employer) {

            return res.status(404).json({
                message: "Employer not found"
            });

        }


        // CHECK ROLE
        if (employer.role !== "employer") {

            return res.status(403).json({
                message: "Only employers can post jobs"
            });

        }


        // CREATE JOB
        const job = new Job({

            title,
            company,
            location,
            salary,
            description,
            skills,
            jobType,
            postedBy: employer._id

        });


        const savedJob =
            await job.save();


        res.status(201).json({
            message: "Job posted successfully",
            job: savedJob
        });


    } catch (error) {

        console.error(
            "Create job error:",
            error
        );

        res.status(500).json({
            message: "Failed to create job",
            error: error.message
        });

    }

});


module.exports = router;