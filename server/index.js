// Import required modules
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Initialize Express
const app = express();
app.use(cors());

// Define a basic route
app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
