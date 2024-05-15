const express = require('express');
const {
  createBooking,
  getBookingById,
  updateBooking,
  deleteBooking,
  getAllBookings,
  getAllBookingsByUserId,
} = require('../../controllers/booking.controller');
const auth = require('../../middlewares/auth'); // Assuming middleware for authentication
const bookingValidation = require('../../validations/booking.validation');
const validate = require('../../middlewares/validate');

const router = express.Router();

router.route('/').post(auth(), validate(bookingValidation.createBooking), createBooking);
router.route('/').get(auth(), getAllBookings);

router
  .route('/:bookingId')
  .get(auth(), validate(bookingValidation.bookingIdParam), getBookingById)
  .patch(auth(), validate(bookingValidation.bookingIdParam), updateBooking)
  .delete(auth(), validate(bookingValidation.bookingIdParam), deleteBooking);

router.get('/user/:userId', validate(bookingValidation.userIdParam), getAllBookingsByUserId);

module.exports = router;
