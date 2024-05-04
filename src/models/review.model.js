const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    reviewedOn: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
reviewSchema.plugin(toJSON);

/**
 * @typedef Review
 */
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
