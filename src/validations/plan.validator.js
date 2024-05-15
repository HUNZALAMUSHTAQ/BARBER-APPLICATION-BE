const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPlan = Joi.object({
  description: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().required().min(0),
  serviceAllowed: Joi.number().min(0),
  imageUrl: Joi.string(),
});

const updatePlan = Joi.object({
    description: Joi.string(),
    name: Joi.string(),
    price: Joi.number().min(0),
    serviceAllowed: Joi.number().min(0),
    imageUrl: Joi.string(),
  });
const planIdParam = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId).required(),
  }),
};
const userIdParam = {
    params: Joi.object().keys({
      userId: Joi.string().custom(objectId).required(),
    }),
  };
module.exports = {
  createPlan,
  planIdParam,
  updatePlan,
  userIdParam
};
