const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/reserve', bookingController.reserveSeatsAndCreateBooking);
router.get('/ticket/:pnr/pdf', bookingController.downloadTicketPDF);

module.exports = router;
