/// new file: backend/models/Notification.js land
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
            required: false
        },

        title: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        },

        type: {
            type: String,
            enum: [
                "Application",
                "Job",
                "System"
            ],
            default: "Application"
        },

        read: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Notification",
        notificationSchema
    );
