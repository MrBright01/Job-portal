const express = require("express");
const router = express.Router();

const Application = require("../models/Application");
const upload = require("../config/upload");
const cloudinary = require("../config/cloudinary");


// =========================================
// APPLY FOR JOB + UPLOAD RESUME
// =========================================

router.post(
    "/",
    upload.single("resume"),
    async (req, res) => {

        try {

            const {
                jobId,
                applicantId
            } = req.body;


            // ==============================
            // VALIDATE BASIC DATA
            // ==============================

            if (!jobId || !applicantId) {

                return res.status(400).json({
                    message:
                        "Job ID and applicant ID are required"
                });

            }


            // ==============================
            // VALIDATE RESUME
            // ==============================

            if (!req.file) {

                return res.status(400).json({
                    message:
                        "Resume PDF is required"
                });

            }


            // ==============================
            // CHECK DUPLICATE APPLICATION
            // ==============================

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


            // ==============================
            // UPLOAD PDF TO CLOUDINARY
            // ==============================

            const uploadResult =
                await new Promise(
                    (resolve, reject) => {

                        const stream =
                            cloudinary.uploader.upload_stream(
                                {
                                    folder:
                                        "job-portal/resumes",
                                    resource_type:
                                        "raw"
                                },

                                (error, result) => {

                                    if (error) {
                                        reject(error);
                                    } else {
                                        resolve(result);
                                    }

                                }
                            );

                        stream.end(
                            req.file.buffer
                        );

                    }
                );


            // ==============================
            // CREATE APPLICATION
            // ==============================

            const application =
                new Application({

                    job: jobId,

                    applicant: applicantId,

                    resume: {

                        fileName:
                            req.file.originalname,

                        fileUrl:
                            uploadResult.secure_url,

                        uploadedAt:
                            new Date()

                    }

                });


            await application.save();


            // ==============================
            // SUCCESS
            // ==============================

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


            // ==============================
            // DUPLICATE APPLICATION
            // ==============================

            if (error.code === 11000) {

                return res.status(400).json({

                    message:
                        "You have already applied for this job"

                });

            }


            // ==============================
            // MULTER ERROR
            // ==============================

            if (
                error.message ===
                "Only PDF resumes are allowed"
            ) {

                return res.status(400).json({

                    message:
                        "Only PDF resumes are allowed"

                });

            }


            // ==============================
            // SERVER ERROR
            // ==============================

            res.status(500).json({

                message:
                    "Server error",

                error:
                    error.message

            });

        }

    }
);


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


            res.status(200).json({
                applications
            });


        } catch (error) {

            console.error(
                "Get user applications error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error",

                error:
                    error.message

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


            res.status(200).json({
                applications
            });


        } catch (error) {

            console.error(
                "Get applicants error:",
                error
            );


            res.status(500).json({

                message:
                    "Server error",

                error:
                    error.message

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


            const allowedStatuses = [
                "Applied",
                "Shortlisted",
                "Accepted",
                "Rejected"
            ];


            if (
                !allowedStatuses.includes(status)
            ) {

                return res.status(400).json({

                    message:
                        "Invalid application status"

                });

            }


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


            if (!application) {

                return res.status(404).json({

                    message:
                        "Application not found"

                });

            }


            res.status(200).json({

                message:
                    `Application ${status.toLowerCase()} successfully`,

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


// =========================================
// EXPORT ROUTER
// =========================================

module.exports = router;