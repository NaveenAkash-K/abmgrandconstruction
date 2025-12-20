const express = require('express');
const router = express.Router();
const whyChooseUsController = require('../controllers/whyChooseUsController');
const { protect } = require('../middleware/auth');

router.get('/', whyChooseUsController.getWhyChooseUs);
router.get('/:id', whyChooseUsController.getWhyChooseUsById);
router.post('/', protect, whyChooseUsController.createWhyChooseUs);
router.put('/reorder', protect, whyChooseUsController.reorderWhyChooseUs);
router.put('/:id', protect, whyChooseUsController.updateWhyChooseUs);
router.delete('/:id', protect, whyChooseUsController.deleteWhyChooseUs);

module.exports = router;
