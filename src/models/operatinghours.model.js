const mongoose = require('mongoose');

const operatingHoursSchema = mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: {
    type: String, // You can use a specific time format if needed
    required: true,
  },
  endTime: {
    type: String, // You can use a specific time format if needed
    required: true,
  },
  appointmentInterval: {
    type: String,
    enum: ['10min', '40min', '1hour'],
    required: true,
  },
  lunchTime: {
    type: String,
    enum: ['12pm', '1pm', '2pm'],
    required: true,
  },
  continuousHours: {
    type: Boolean
  },
});

const OperatingHours = mongoose.model('OperatingHours', operatingHoursSchema);

module.exports = OperatingHours;
