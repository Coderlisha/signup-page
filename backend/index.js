const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "https://signup-page-lovat.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "numetry",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profilePhoto: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("Hi");
});

app.post("/api/signup", upload.single("photo"), async (req, res) => {
  const { name, email, password } = req.body;

  console.log(req.file);

  const profilePhoto = req.file ? req.file.path : null; // Cloudinary image URL
  if (!profilePhoto) {
    return res.status(400).json({ message: "No photo uploaded" });
  }

  try {
    const newUser = new User({
      name,
      email,
      password,
      profilePhoto,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", profilePhoto });
  } catch (error) {
    console.error("Error saving user:", error);
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

    res.status(200).json({
      message: "Login successful",
    });
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
