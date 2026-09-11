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


        if (!jobId || !applicantId) {

            return res.status(400).json({
                message:
                    "Job ID and applicant ID are required"
            });

        }


        // Check if already applied

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


        // Create application

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
                    .populate("job")
                    .sort({
                        createdAt: -1
                    });


            res.json({
                applications
            });


        } catch (error) {

            console.error(error);

            res.status(500).json({
                message:
                    "Server error"
            });

        }

    }
);


module.exports = router;