const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Movie = require("../models/movie");

const getStreamById = async (req, res) => {
  try {
    const movieId = req.params.id;

    // Fetch movie details from MongoDB
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const videoPath = path.join(__dirname, "..", movie.video); // Resolve the video file path
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ error: "Video file not found" });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Parse the Range header
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      // Validate range
      if (start >= fileSize || end >= fileSize) {
        res
          .status(416)
          .send(`Requested range not satisfiable\n${start}-${end}/${fileSize}`);
        return;
      }

      const chunkSize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(206, headers); // Partial Content
      file.pipe(res);
    } else {
      // No range header, send the entire file
      const headers = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };

      res.writeHead(200, headers);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error("Error streaming video:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getStreamById };
