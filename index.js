const { configDotenv } = require('dotenv');
const express = require('express');
const app = express();

// Database
const database = require('./config/database');
database.connect();
// Middleware to parse JSON
app.use(express.json());
require('dotenv').config();

// Routes
const  AuthRouter = require('./routes/AuthRouter');
app.use('/Home/api/v1/', AuthRouter);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
