const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, upload.single('image'), uploadController.uploadImage);
router.post('/multiple', protect, upload.array('images', 10), uploadController.uploadMultipleImages);

module.exports = router;
