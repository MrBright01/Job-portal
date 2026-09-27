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

        console.error("GET JOBS ERROR:", error);

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
            "CREATE JOB ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to create job",
            error: error.message
        });

    }

});


// ===============================
// EDIT JOB
// PUT /api/jobs/:jobId
// ===============================
router.put("/:jobId", async (req, res) => {

    try {

        const {
            title,
            company,
            location,
            salary,
            description,
            skills,
            jobType
        } = req.body;


        const job =
            await Job.findById(req.params.jobId);


        if (!job) {

            return res.status(404).json({
                message: "Job not found"
            });

        }


        // UPDATE PROVIDED FIELDS

        if (title !== undefined) {
            job.title = title.trim();
        }

        if (company !== undefined) {
            job.company = company.trim();
        }

        if (location !== undefined) {
            job.location = location.trim();
        }

        if (salary !== undefined) {
            job.salary = salary.trim();
        }

        if (description !== undefined) {
            job.description = description.trim();
        }

        if (skills !== undefined) {

            job.skills =
                Array.isArray(skills)
                    ? skills
                    : [];

        }

        if (jobType !== undefined) {
            job.jobType = jobType;
        }


        const updatedJob =
            await job.save();


        res.status(200).json({

            message: "Job updated successfully",

            job: updatedJob

        });


    } catch (error) {

        console.error(
            "EDIT JOB ERROR:",
            error
        );

        res.status(500).json({

            message: "Failed to update job",

            error: error.message

        });

    }

});


// ===============================
// CHANGE JOB STATUS
// PUT /api/jobs/:jobId/status
// ===============================
router.put("/:jobId/status", async (req, res) => {

    try {

        const {
            status
        } = req.body;


        // CHECK STATUS

        if (
            !["Active", "Closed"].includes(status)
        ) {

            return res.status(400).json({

                message:
                    "Status must be Active or Closed"

            });

        }


        const job =
            await Job.findById(
                req.params.jobId
            );


        if (!job) {

            return res.status(404).json({

                message: "Job not found"

            });

        }


        job.status = status;


        const updatedJob =
            await job.save();


        res.status(200).json({

            message:
                `Job ${status.toLowerCase()} successfully`,

            job: updatedJob

        });


    } catch (error) {

        console.error(
            "CHANGE JOB STATUS ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Failed to change job status",

            error: error.message

        });

    }

});


// ===============================
// DELETE JOB
// DELETE /api/jobs/:jobId
// ===============================
router.delete("/:jobId", async (req, res) => {

    try {

        const job =
            await Job.findById(
                req.params.jobId
            );


        if (!job) {

            return res.status(404).json({

                message: "Job not found"

            });

        }


        await Job.findByIdAndDelete(
            req.params.jobId
        );


        res.status(200).json({

            message:
                "Job deleted successfully"

        });


    } catch (error) {

        console.error(
            "DELETE JOB ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Failed to delete job",

            error: error.message

        });

    }

});


module.exports = router;