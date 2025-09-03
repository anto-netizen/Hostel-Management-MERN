// routes/messBillRoute.js
const express = require('express');
const router = express.Router();
const messBillController = require('../controllers/messBillController');

router.post('/generate', messBillController.generateBills);
router.get('/', messBillController.getAllBills);
router.get('/student/:studentId', messBillController.getBillsByStudent);

module.exports = router;
