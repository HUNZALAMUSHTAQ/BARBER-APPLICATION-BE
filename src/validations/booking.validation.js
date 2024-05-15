const Joi = require('joi');
const { objectId } = require('./custom.validation'); // Assuming custom.validation.js defines objectId

const createBooking = Joi.object({
  user: Joi.string().custom(objectId).required(),  // User reference using custom objectId validation
  barber: Joi.string().custom(objectId).required(), // Barber reference using custom objectId validation
  description: Joi.string().required(),
  servicesId: Joi.string().custom(objectId).allow(null),
  bookingDate: Joi.date(), 
  plansId: Joi.string().custom(objectId).allow(null),  // Optional plan reference using custom objectId validation
});

const updateBooking = Joi.object({
  user: Joi.string().custom(objectId).allow(null), // Optional user reference using custom objectId validation
  barber: Joi.string().custom(objectId).allow(null), // Optional barber reference using custom objectId validation
  description: Joi.string(),
  servicesId: Joi.string().custom(objectId).allow(null), // Optional service reference using custom objectId validation
  plansId: Joi.string().custom(objectId).allow(null),  // Optional plan reference using custom objectId validation
});

const bookingIdParam = {
  params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId).required(),
  }),
};

const userIdParam = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createBooking,
  updateBooking,
  bookingIdParam,
  userIdParam,
};
