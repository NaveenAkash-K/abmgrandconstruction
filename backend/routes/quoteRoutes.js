const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');
const { protect } = require('../middleware/auth');

router.post('/', quoteController.createQuote);

router.get('/', protect, quoteController.getQuotes);
router.get('/:id', protect, quoteController.getQuote);
router.delete('/:id', protect, quoteController.deleteQuote);

module.exports = router;
