const { configDotenv } = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require('./routes/AuthRouter');
require('dotenv').config();


// Database
const database = require('./config/database');
database.connect();


// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);



// Setting up routes
app.use("/api/v1/auth", userRoutes);



// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
