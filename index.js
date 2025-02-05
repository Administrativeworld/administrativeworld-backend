const { configDotenv } = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require('./routes/AuthRouter'); // Ensure this path is correct
const userCourse = require('./routes/userCourses');
const userProfile = require('./routes/Profile');
const Post = require('./routes/PostRoutes');
const userContact = require('./routes/Contack');
const userPayment = require('./routes/Payment');
const fileUpload = require("express-fileupload");
require('dotenv').config();

// Database
const database = require('./config/database');
database.connect();
// Connecting to cloudinary
const { cloudinaryConnect } = require("./config/cloudinary");
cloudinaryConnect();

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: 'http://localhost:5173', // Replace with your frontend URL
	credentials: true
}));
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);



// status of app 
const { monitorMiddleware, monitorRoute } = require("./utils/Status");
app.use(monitorMiddleware);
app.get("/status", monitorRoute);

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
