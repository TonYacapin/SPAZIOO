const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const router = express.Router();

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Create multer instance with storage options
const upload = multer({ storage: storage });

// POST endpoint for uploading image
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Upload file to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Send back cloudinary response
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload image to cloudinary' });
  }
});

module.exports = router;
