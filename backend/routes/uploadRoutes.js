const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, uploadController.getImages);
router.get('/:id', uploadController.getImage);
router.get('/:id/info', uploadController.getImageInfo);
router.post('/', protect, upload.single('image'), uploadController.uploadImage);
router.post('/multiple', protect, upload.array('images', 10), uploadController.uploadMultipleImages);
router.delete('/', protect, uploadController.deleteImageByUrl);
router.delete('/multiple', protect, uploadController.deleteMultipleImages);
router.delete('/:id', protect, uploadController.deleteImage);

module.exports = router;
