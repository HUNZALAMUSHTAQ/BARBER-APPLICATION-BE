const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRoom = {
  body: Joi.object().keys({
    user1: Joi.string().custom(objectId),
    user2: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRoom,
};
