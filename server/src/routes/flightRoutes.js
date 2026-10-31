const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');

router.get('/search', flightController.searchFlights);
router.get('/:flightId/seats', flightController.getFlightSeats);
router.patch('/:id/status', flightController.updateFlightStatus);

module.exports = router;
