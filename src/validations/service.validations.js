const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createService = {
  body: Joi.object().keys({
    description: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    imageUrl: Joi.string().uri().optional(),
  }),
};

const updateService = {
  params: Joi.object().keys({
    serviceId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    description: Joi.string().optional(),
    name: Joi.string().optional(),
    price: Joi.number().optional(),
    imageUrl: Joi.string().uri().optional(),
  }).min(1),
};

const serviceIdParam = {
  params: Joi.object().keys({
    serviceId: Joi.string().custom(objectId).required(),
  }),
};

const userIdParam = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createService,
  updateService,
  serviceIdParam,
  userIdParam,
};
