const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const planSchema = mongoose.Schema(
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
    },
    serviceAllowed: {
        type: String,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
planSchema.plugin(toJSON);

/**
 * @typedef Plan
 */
const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
