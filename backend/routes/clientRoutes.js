const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { protect } = require('../middleware/auth');

router.get('/', clientController.getClients);
router.get('/:id', clientController.getClient);
router.post('/', protect, clientController.createClient);
router.put('/:id/toggle', protect, clientController.toggleClient);
router.put('/:id', protect, clientController.updateClient);
router.delete('/:id', protect, clientController.deleteClient);

module.exports = router;
