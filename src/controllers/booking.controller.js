const httpStatus = require('http-status');
const { Booking, Services, Plan } = require('../models');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createBooking = catchAsync(async (req, res) => {
  const booking = await Booking.create(req.body);
  res.status(httpStatus.CREATED).send(booking);
});

const deleteBooking = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findByIdAndDelete(bookingId);
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  res.status(httpStatus.OK).send({ message: 'Plan deleted successfully' });
});

const updateBooking = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const booking = await Booking.findByIdAndUpdate(bookingId, req.body, { new: true });
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  res.send(booking);
});

const getBookingById = catchAsync(async (req, res) => {
    const bookingId = req.params.bookingId;
  
    const booking = await Booking.findById(bookingId)
      .populate('user', 'name email phone') // Populate user details
      .populate({
        path: 'Services',
        model: Services, // Populate Service details if servicesId exists
      })
      .populate({
        path: 'Plan',
        model: Plan, // Populate Plan details if plansId exists
      });
  
    if (!booking) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
    }
  
    res.status(httpStatus.OK).send(booking);
  });
  
  const getAllBookings = catchAsync(async (req, res) => {
    const bookings = await Booking.find()
      .populate('user', 'name email phone') // Populate user details
      .populate({
        path: 'Services',
        model: Services, // Populate Service details if servicesId exists
      })
      .populate({
        path: 'Plan',
        model: Plan, // Populate Plan details if plansId exists
      });
  
    res.status(httpStatus.OK).send(bookings);
  });
  
  const getAllBookingsByUserId = catchAsync(async (req, res) => {
    const userId = req.params.userId;
  
    const bookings = await Booking.find({ user: userId })
      .populate('user', 'name email phone') // Populate user details
      .populate("Services")
      .populate("Plan");
  
    res.status(httpStatus.OK).send(bookings);
  });
  
  module.exports = {
    createBooking,
    getBookingById,
    updateBooking, 
    deleteBooking,
    getAllBookings,
    getAllBookingsByUserId,
  };