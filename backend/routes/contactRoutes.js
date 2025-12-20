const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.get('/', contactController.getContact);
router.post('/', protect, contactController.createContact);
router.put('/', protect, contactController.updateContact);
router.delete('/', protect, contactController.deleteContact);

module.exports = router;
