const mongoose = require("mongoose");
const router = require("../routes/applicationRoutes");

const applicationSchema = new mongoose.Schema(
    {
        // ===============================
        // JOB APPLIED FOR
        // ===============================

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        // ===============================
        // JOB SEEKER
        // ===============================

        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // ===============================
        // APPLICATION STATUS
        // ===============================

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


// ===============================
// PREVENT DUPLICATE APPLICATIONS
// ===============================

applicationSchema.index(
    {
        job: 1,
        applicant: 1
    },
    {
        unique: true
    }
);


module.exports = mongoose.model(
    "Application",
    applicationSchema
);

module.exports =router;
// =========================================
// UPDATE APPLICATION STATUS
// =========================================

router.put("/:applicationId/status", async (req, res) => {
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
                message: "Invalid application status"
            });
        }

        const application =
            await Application.findByIdAndUpdate(
                req.params.applicationId,
                {
                    status: status
                },
                {
                    new: true
                }
            );

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({
            message: `Application ${status.toLowerCase()} successfully`,
            application
        });

    } catch (error) {

        console.error(
            "Update application status error:",
            error
        );

        res.status(500).json({
            message: "Failed to update application status"
        });
    }
});