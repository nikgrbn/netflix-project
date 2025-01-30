const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure Multer storage with dynamic directories
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine the directory based on the request path or another condition
    const directory = req.baseUrl.includes("/movies")
      ? "uploads/movies/"
      : "uploads/users/";

    // Ensure the directory exists
    fs.mkdirSync(directory, { recursive: true });

    cb(null, directory); // Pass the directory to Multer
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = { upload };
