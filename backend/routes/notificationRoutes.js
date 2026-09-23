const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");

// ==============================
// GET USER NOTIFICATIONS
// ==============================

router.get("/user/:userId", async (req, res) => {

    try {

        const notifications =
            await Notification
                .find({
                    user: req.params.userId
                })
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            notifications
        });

    } catch (error) {

        console.error(
            "Get notifications error:",
            error
        );

        res.status(500).json({
            message: "Failed to load notifications"
        });

    }

});


// ==============================
// MARK NOTIFICATION AS READ
// ==============================

router.put("/:notificationId/read", async (req, res) => {

    try {

        const notification =
            await Notification.findByIdAndUpdate(
                req.params.notificationId,
                {
                    read: true
                },
                {
                    new: true
                }
            );

        if (!notification) {

            return res.status(404).json({
                message: "Notification not found"
            });

        }

        res.status(200).json({
            message: "Notification marked as read",
            notification
        });

    } catch (error) {

        console.error(
            "Mark notification read error:",
            error
        );

        res.status(500).json({
            message: "Failed to update notification"
        });

    }

});


// ==============================
// MARK ALL AS READ
// ==============================

router.put("/user/:userId/read-all", async (req, res) => {

    try {

        await Notification.updateMany(
            {
                user: req.params.userId,
                read: false
            },
            {
                $set: {
                    read: true
                }
            }
        );

        res.status(200).json({
            message: "All notifications marked as read"
        });

    } catch (error) {

        console.error(
            "Mark all notifications read error:",
            error
        );

        res.status(500).json({
            message: "Failed to update notifications"
        });

    }

});


module.exports = router;