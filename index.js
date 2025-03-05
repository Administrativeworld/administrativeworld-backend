import { configDotenv } from 'dotenv';
import express from 'express';
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from './routes/AuthRouter.js'; // Ensure this path is correct
import userCourse from './routes/userCourses.js';
import userProfile from './routes/Profile.js';
import Post from './routes/PostRoutes.js';
import userContact from './routes/Contack.js';
import userPayment from './routes/Payment.js';
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
dotenv.config();

// Database

import connect from './config/database.js';
connect();

// Connecting to cloudinary
import { cloudinaryConnect } from "./config/cloudinary.js";

cloudinaryConnect();

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

app.use(cors({
	origin: ['https://administrativeworld2.netlify.app'], // Allow specific web origins
	credentials: true, // Allow cookies & credentials for web
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);



// status of app 
import monitor from "./utils/Status.js";
app.use(monitor.monitorMiddleware);
app.get("/status", monitor.monitorRoute);

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/courses", userCourse);
app.use("/api/v1/profile", userProfile);
app.use("/api/v1/contact", userContact);
app.use("/api/v1/payment", userPayment);
app.use("/api/v1/post", Post);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT} ✅`);
});
