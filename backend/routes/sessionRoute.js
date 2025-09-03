// routes/sessionRoute.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.get('/', sessionController.getAllSessions);
router.post('/', sessionController.createSession);
router.put('/:id', sessionController.updateSession);
// Special route for activating a session
router.patch('/activate/:id', sessionController.setActiveSession);

module.exports = router;
