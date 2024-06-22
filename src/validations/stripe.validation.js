const Joi = require('joi');
const { objectId } = require('./custom.validation');

const purchaseItem = {
  params: Joi.object().keys({
    producId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  purchaseItem
};
