const Joi = require('joi');
const { objectId } = require('./custom.validation');

const purchaseItem = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    paymentType: Joi.string().required(),
  }),
};

module.exports = {
  purchaseItem
};
