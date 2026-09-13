const express = require("express");
const router = express.Router();

const Application =
    require("../models/Application");


// =====================================
// APPLY FOR A JOB
// =====================================

router.post("/", async (req, res) => {

    try {

        const {
            jobId,
            applicantId
        } = req.body;


        // ===============================
        // VALIDATE
        // ===============================

        if (!jobId || !applicantId) {

            return res.status(400).json({
                message:
                    "Job ID and applicant ID are required"
            });

        }


        // ===============================
        // CHECK DUPLICATE
        // ===============================

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


        // ===============================
        // CREATE APPLICATION
        // ===============================

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


        // Duplicate index protection

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


// =====================================
// GET USER APPLICATIONS
// =====================================

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
                    .populate(
                        "job"
                    )
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


// =====================================
// GET APPLICANTS FOR A JOB
// =====================================

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


module.exports = router;