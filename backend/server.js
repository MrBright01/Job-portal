//====================================
      //SERVER CODE      
//====================================


const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/jobs", jobRoutes);
app.use("/api/auth", authRoutes);

mongoose
    .connect(process.env.MONGODB_URI, {
        family: 4
    })
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(5000, () => {
            console.log("Server running on http://localhost:5000");
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });