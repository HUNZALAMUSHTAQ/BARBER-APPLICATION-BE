const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const serviceSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
serviceSchema.plugin(toJSON);

/**
 * @typedef Service
 */
const Services = mongoose.model('Services', serviceSchema);

module.exports = Services;
