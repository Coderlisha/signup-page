const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "https://signup-page-lovat.vercel.app", // Allow this specific origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
    credentials: true, // Allow credentials if needed
  })
);

app.use(express.json());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);
module.exports = { User };

app.get("/", (req, res) => {
  res.send("Hi");
});

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving user", error });
  }
});
app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.password !== password) {
      return res.status(401).send("Invalid credentials");
    }

    res.status(200).send("Login successful");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Server error");
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

module.exports = app;
