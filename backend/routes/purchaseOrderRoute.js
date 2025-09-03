// routes/purchaseOrderRoute.js
const express = require('express');
const router = express.Router();
const poController = require('../controllers/purchaseOrderController');

router.get('/', poController.getAllPOs);
router.get('/:id', poController.getPOById);
router.post('/', poController.createPO);
router.patch('/:id/status', poController.updatePOStatus);

module.exports = router;
