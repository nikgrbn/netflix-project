const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Movie = require("../models/movie");

const getStreamById = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }

    const videoPath = path.join(__dirname, "..", movie.video);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ error: "Video file not found" });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Default chunk size (1MB)
    const CHUNK_SIZE = 1024 * 1024;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + CHUNK_SIZE, fileSize - 1);

      if (start >= fileSize) {
        res.status(416).send('Requested range not satisfiable');
        return;
      }

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": 0
      };

      res.writeHead(206, headers);
      const videoStream = fs.createReadStream(videoPath, { start, end });
      videoStream.pipe(res);
    } else {
      // Handle the case when range is not provided (first request)
      const headers = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": 0
      };

      res.writeHead(200, headers);
      const videoStream = fs.createReadStream(videoPath);
      videoStream.pipe(res);
    }
  } catch (error) {
    console.error("Error streaming video:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getStreamById
};