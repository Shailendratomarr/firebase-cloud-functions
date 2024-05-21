const express = require('express');
const router = express.Router();
const bookingControler = require('../controller/booking');


router.post('/booking',bookingControler.postBooking);

router.get('/getSingleBooking/:id',bookingControler.getSingleBooking)


router.put('/editBookingDetails/:id',bookingControler.putEditDetails);

router.get('/getAllBooking',bookingControler.getAllBookings);

router.delete('/deleteBooking/:id',bookingControler.deleteSingleBooking);

module.exports = router;