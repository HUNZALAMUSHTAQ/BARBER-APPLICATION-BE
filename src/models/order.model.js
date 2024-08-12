const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    sellerId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Product',
      required: true,
    },
    paymentType: {
      type: String,
      enum: ['payment', 'subscription'],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    customerDetails: {
      type:mongoose.SchemaTypes.Mixed
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);

/**
 * @typedef Booking
 */
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
