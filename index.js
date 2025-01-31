require("dotenv").config();
const express = require("express");
const { resolve } = require("path");
const mongoose = require("mongoose");
const User = require("./schema");

const app = express();
const port = 3010;

app.use(express.static("static"));
app.use(express.json()); // Middleware to parse JSON requests

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((error) => {
    console.error("Error connecting to database:", error.message);
  });

// Add User Route (POST)
app.post("/adduser", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation: Ensure all fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Create and save new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error saving user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the API for storing data in database" });
  });

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
