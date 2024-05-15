const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    bookingDate: {
      type: Date,
    },
    barber: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String
    },
    servicesId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Services',
    },
    plansId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Plan',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
bookingSchema.plugin(toJSON);

/**
 * @typedef Booking
 */
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
