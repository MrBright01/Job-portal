const express = require("express");
const router = express.Router();

const Application = require("../models/Application");


// =========================================
// APPLY FOR JOB
// =========================================

router.post("/", async (req, res) => {

    try {

        const {
            jobId,
            applicantId
        } = req.body;

        if (!jobId || !applicantId) {

            return res.status(400).json({
                message:
                    "Job ID and applicant ID are required"
            });

        }

        const existingApplication =
            await Application.findOne({
                job: jobId,
                applicant: applicantId
            });

        if (existingApplication) {

            return res.status(400).json({
                message:
                    "You have already applied for this job"
            });

        }

        const application =
            new Application({
                job: jobId,
                applicant: applicantId
            });

        await application.save();

        res.status(201).json({

            message:
                "Application submitted successfully",

            application

        });

    } catch (error) {

        console.error(
            "Application error:",
            error
        );

        if (error.code === 11000) {

            return res.status(400).json({
                message:
                    "You have already applied for this job"
            });

        }

        res.status(500).json({
            message:
                "Server error"
        });

    }

});


// =========================================
// GET USER APPLICATIONS
// =========================================

router.get(
    "/user/:userId",
    async (req, res) => {

        try {

            const applications =
                await Application
                    .find({
                        applicant:
                            req.params.userId
                    })
                    .populate("job")
                    .sort({
                        createdAt: -1
                    });

            res.json({
                applications
            });

        } catch (error) {

            console.error(
                "Get user applications error:",
                error
            );

            res.status(500).json({
                message:
                    "Server error"
            });

        }

    }
);


// =========================================
// GET APPLICANTS FOR A JOB
// =========================================

router.get(
    "/job/:jobId",
    async (req, res) => {

        try {

            const applications =
                await Application
                    .find({
                        job:
                            req.params.jobId
                    })
                    .populate(
                        "applicant",
                        "name email phone location education skills experience about profilePhoto"
                    )
                    .populate(
                        "job",
                        "title company location salary jobType"
                    )
                    .sort({
                        createdAt: -1
                    });

            res.json({
                applications
            });

        } catch (error) {

            console.error(
                "Get applicants error:",
                error
            );

            res.status(500).json({
                message:
                    "Server error"
            });

        }

    }
);


// =========================================
// UPDATE APPLICATION STATUS
// =========================================

router.put(
    "/:applicationId/status",
    async (req, res) => {

        try {

            const {
                status
            } = req.body;


            // Allowed statuses
            const allowedStatuses = [
                "Applied",
                "Shortlisted",
                "Accepted",
                "Rejected"
            ];


            // Check status
            if (
                !allowedStatuses.includes(status)
            ) {

                return res.status(400).json({

                    message:
                        "Invalid application status"

                });

            }


            // Find and update application
            const application =
                await Application.findByIdAndUpdate(

                    req.params.applicationId,

                    {
                        status: status
                    },

                    {
                        new: true,
                        runValidators: true
                    }

                );


            // Application doesn't exist
            if (!application) {

                return res.status(404).json({

                    message:
                        "Application not found"

                });

            }


            // Success
            res.status(200).json({

                message:
                    `Application ${status.toLowerCase()} successfully`,

                application:
                    application

            });

        } catch (error) {

            console.error(
                "Update application status error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to update application status",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;