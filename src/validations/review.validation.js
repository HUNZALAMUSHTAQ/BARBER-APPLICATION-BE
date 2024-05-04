const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    barberId: Joi.string().custom(objectId),
    reviewBy: Joi.string().custom(objectId),
    description: Joi.string().required(),
    stars: Joi.number().min(1).max(5),
  }),
};

const updateReview = {
  body: Joi.object().keys({
    description: Joi.string().required(),
    stars: Joi.number().min(1).max(5),
  }),
};
const deleteReview = {
  params: Joi.object().keys({
    reviewId: Joi.string().custom(objectId).required(),
  }),
};
const getAllReviewsByBarberId = {
  params: Joi.object().keys({
    barberId: Joi.string().custom(objectId).required(),
  }),
};
const userIdParam = {
    params: Joi.object().keys({
      userId: Joi.string().custom(objectId).required(),
    }),
  };
module.exports = {
  createReview,
  deleteReview,
  getAllReviewsByBarberId,
  updateReview,
  userIdParam
};
