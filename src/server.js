import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/corsOptions.js";
import { usersRoute } from "./routes/usersRoute.js";
import { remindersRoute } from "./routes/remindersRoute.js";
dotenv.config();

const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on("error", (err) => {
    console.log("err", err);
});
mongoose.connection.on("connected", (err) => {
    if (err) {
        console.log(err);
    }
    console.log("Connected to MongoDB.");
});

// Set up Express server
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes for the web server
app.get("/", (req, res) => {
    res.send("It's working.");
});

app.use("/users", usersRoute);
app.use("/reminders", remindersRoute);

app.listen(PORT, () => {
    const currentTime = new Date().toLocaleTimeString();
    console.log(`[${currentTime}] Server running on port ${PORT}.`);
});
