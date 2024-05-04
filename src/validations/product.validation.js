const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = Joi.object({
  stars: Joi.number().required().min(1).max(5),
  description: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().required().min(0),
  stock: Joi.number().min(0),
  imageUrl: Joi.string(),
});

const updateProduct = Joi.object({
    stars: Joi.number().min(1).max(5),
    description: Joi.string(),
    name: Joi.string(),
    price: Joi.number().min(0),
    stock: Joi.number().min(0),
    imageUrl: Joi.string(),
  });
const prodIdParam = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
};
const userIdParam = {
    params: Joi.object().keys({
      userId: Joi.string().custom(objectId).required(),
    }),
  };
module.exports = {
  createProduct,
  prodIdParam,
  updateProduct,
  userIdParam
};
