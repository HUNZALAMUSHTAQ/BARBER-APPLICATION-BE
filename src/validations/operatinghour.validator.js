// validators/operatingHours.validator.js

const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOperatingHoursSchema = Joi.object({
  day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  appointmentInterval: Joi.string().valid('10min', '40min', '1hour').required(),
  lunchTime: Joi.string().valid('12pm', '1pm', '2pm').required(),
  continuousHours: Joi.boolean(),
});

const updateOperatingHoursSchema = Joi.object({
  user: Joi.string(),
  day: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
  startTime: Joi.string(),
  endTime: Joi.string(),
  appointmentInterval: Joi.string().valid('10min', '40min', '1hour'),
  lunchTime: Joi.string().valid('12pm', '1pm', '2pm'),
  continuousHours: Joi.boolean(),
}).min(1);

const operatingHoursIdSchema = Joi.object({
  params: Joi.object().keys({
    operatingHoursId: Joi.string().custom(objectId).required(),
  }),
});
const userIdSchema = {
    params: Joi.object().keys({
      userId: Joi.string().custom(objectId).required(),
    }),
  };
module.exports = {
  createOperatingHoursSchema,
  updateOperatingHoursSchema,
  operatingHoursIdSchema,
  userIdSchema
};
