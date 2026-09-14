const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Application =
    require("../models/Application");

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

    // =========================================
// UPDATE APPLICATION STATUS
// =========================================

router.put(
    "/:applicationId/status",
    async (req, res) => {

        try {

            const { status } = req.body;

            const allowedStatuses = [
                "Applied",
                "Shortlisted",
                "Accepted",
                "Rejected"
            ];

            if (!allowedStatuses.includes(status)) {

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