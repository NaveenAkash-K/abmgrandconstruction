const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const { protect } = require('../middleware/auth');

router.get('/', aboutController.getAbout);
router.post('/', protect, aboutController.createAbout);
router.put('/', protect, aboutController.updateAbout);
router.delete('/', protect, aboutController.deleteAbout);

module.exports = router;
