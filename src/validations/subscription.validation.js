const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSubscription = {
  body: Joi.object().keys({
    barberId: Joi.string().required().custom(objectId),
    description: Joi.string().required(),
    paymentCycle: Joi.string().required().valid('monthly', 'yearly', 'weekly'),
    amount: Joi.number().required().min(0),
  }),
};

const getSubscriptions = {
  query: Joi.object().keys({
    barberId: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSubscription = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const updateSubscription = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      barberId: Joi.string().custom(objectId),
      description: Joi.string(),
      paymentCycle: Joi.string().valid('monthly', 'yearly', 'weekly'),
      amount: Joi.number().min(0),
    })
    .min(1),
};

const deleteSubscription = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createSubscription,
  getSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
};
