const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/metrics', adminController.getMetrics);
router.get('/flights', adminController.getAllFlights);
router.post('/flights', adminController.createFlight);

module.exports = router;
