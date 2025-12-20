const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');

router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getService);
router.post('/', protect, serviceController.createService);
router.put('/:id', protect, serviceController.updateService);
router.delete('/:id', protect, serviceController.deleteService);

module.exports = router;
