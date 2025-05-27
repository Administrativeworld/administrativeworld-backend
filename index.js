import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import connect from './config/database.js';
import { cloudinaryConnect } from "./config/cloudinary.js";
import socketIoServer from './socket/socket.js';
import { setupMediasoup } from './mediaSoup/mediaSoupServer.js'; // Import Mediasoup setup

dotenv.config();

// Initialize Express app
const app = express();

// Connect to Database and Cloudinary
await connect();  // Ensure database is connected before proceeding
await cloudinaryConnect();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: ['https://stellar-lebkuchen-66e1df.netlify.app', 'http://localhost:5173'],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(fileUpload({
	useTempFiles: true,
	tempFileDir: "/tmp/",
}));

// Routes
import userRoutes from './routes/AuthRouter.js';
import userCourse from './routes/userCourses.js';
import userProfile from './routes/Profile.js';
import Post from './routes/PostRoutes.js';
import userContact from './routes/Contack.js';
import userPayment from './routes/Payment.js';
import Bookstore from './routes/BookStoreRouter.js';

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/courses", userCourse);
app.use("/api/v1/profile", userProfile);
app.use("/api/v1/contact", userContact);
app.use("/api/v1/payment", userPayment);
app.use("/api/v1/post", Post);
app.use("/api/v1/bookstore", Bookstore);

// Create HTTP Server
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: ['https://stellar-lebkuchen-66e1df.netlify.app', 'http://localhost:5173'],
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true
	}
});
// Somewhere in your Express app file
import { routers } from './mediaSoup/mediaSoupServer.js';

app.get("/rtpCapabilities/:courseId", (req, res) => {
	const { courseId } = req.params;
	const router = routers[courseId];

	if (!router) {
		return res.status(404).json({ error: "Router not found for this course" });
	}

	res.json(router.rtpCapabilities);
});


// Setup WebSocket and Mediasoup (pass `io`, not `server`)
socketIoServer(io);
setupMediasoup(io);  // ✅ Pass `io` instead of `server`

// Start the Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT} ✅`);
	console.log(`Socket.IO is initialized and running`);
});
