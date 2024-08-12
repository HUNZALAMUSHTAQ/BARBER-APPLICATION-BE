const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { User, Product, Order } = require('../models');
const catchAsync = require('../utils/catchAsync');
const Stripe = require('stripe');
const config = require('../config/config');
const mongoose = require('mongoose');

const stripe = Stripe(config.stripe.secretKey);

const onBoardSeller = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) { 
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.stripeId) {
    const chargesEnabled = await stripe.accounts.retrieve(user.stripeId)
    if (chargesEnabled?.charges_enabled) {
      return res.status(302).json({ message: 'User already onboarded' });
    } else {
      const accountLink = await stripe.accountLinks.create({
        account: user.stripeId,
        refresh_url: 'https://barber-app.com',
        return_url: 'https://barber-app.com',
        type: 'account_onboarding',
      });
      return res.status(httpStatus.OK).json({ url: accountLink.url });
    };
  };

    const account = await stripe.accounts.create({
      type: 'express',
      email: user.email,
      business_type: 'individual',
      individual: {
        first_name: user.name,
        email: user.email,
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://barber-app.com',
      return_url: 'https://barber-app.com',
      type: 'account_onboarding',
    });

  await User.findOneAndUpdate({ _id: userId }, { stripeId: account.id });

  res.status(httpStatus.OK).json({url: accountLink.url});
});

const createCheckoutSession = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const productId = req.params.productId;
    if (!productId) {
      return res.status(400).json({ message: 'Product id is required' });
    };

    const product = await Product.findById(productId).populate('user');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < 1) {
      return res.status(400).json({ message: 'Product out of stock' });
    }
    const amount = Number(product.price);
    const platformFee = Math.round(amount * 0.10);
    const paymentMode = product?.type === 'product'? 'payment': 'subscription';
    const recurringSchedule = 'monthly';
    paymentObject = {
      customer_email: user.email,
      mode: paymentMode,
      recurringSchedule: paymentMode === 'subscription' ? recurringSchedule : '',
      success_url: 'https://barber-app.com',
      cancel_url: 'https://barber-app.com',
      metadata: {
        userId: user._id.toString(),
        productId: productId,
        platformFee: platformFee,
        totalAmount: amount,
        paymentType: paymentMode,
        sellerId: product.user._id.toString(),
        paymentMode
      },
      billing_address_collection: 'required',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: amount * 100,
            product_data: {
              name: product.name,
              description: product.description,
              images: [product.imageUrl],
              metadata: {
                originalPrice: product.price,
              }
            },
            recurring: paymentMode === 'subscription' ?{
              interval: 'month'
            }: {},
          },
          quantity: 1,
        },
      ],
      payment_intent_data: paymentMode === 'payment' ? {
        application_fee_amount: platformFee * 100,
        description: `Payment From ${user.email}`,
        transfer_data: {
          destination: product.user.stripeId,
        },
        metadata: {
          userId: user._id.toString(),
          productId: productId,
          platformFee: platformFee,
          totalAmount: amount,
          sellerId: product.user._id.toString(),
          paymentMode
        }
      } : {},
    };
    const session = await stripe.checkout.sessions.create(paymentObject);
    return res.status(200).json({ url: session?.url, id: session?.id });

});

const stripeWebhook = catchAsync(async (req, res) => {
  try {
  const endpointSecret = "whsec_387380e2f609c468a8a54e4a7bcb302d52be3be5ba2c3dad25a7354d373789a6";
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await createOrder(session);
  }
  res.send();
  return
}
  catch (error) {
    console.log("🚀 ~ stripeWebhook ~ error:", error);
    return res.status(400).json({ message: 'Webhook Error' });
  }
});

const createOrder = async (session) => {
  try {
    const sessionId = session.id;
    const customerDetails = session.customer_details;
    const metadata = session.metadata;
    const paymentType = metadata.paymentType;
    const totalAmount = Number(metadata.totalAmount);
    const platformFee = Number(metadata.platformFee);
    const productId = metadata.productId;
    const sellerId = metadata.sellerId;
    const userId = metadata.userId;

    const order = new Order({
      user: userId,
      sellerId: sellerId,
      productId: productId,
      paymentType: paymentType,
      totalAmount: totalAmount,
      customerDetails: customerDetails,
    });
    const product = await Product.findById(productId);
    product.stock = product.stock - 1;

    await Promise.all([order.save(), product.save()]);
    return;
  } catch (error) {
    console.log("🚀 ~ createOrder ~ error:", error)
    if (session.mode === 'subscription') {
      const canceledSubscription = await stripe.subscriptions.cancel(session.subscription, {
        prorate: true // this return the payment amount
      });
    } else {
      const refund = await stripe.refunds.create({
        payment_intent: session.payment_intent
      });
    }
    return error;
  }
};

const getOrderForUser = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.find({ user: userId }).sort({_id:-1}).populate('productId').populate('sellerId');
  res.status(200).json(orders);
});

const getOrderForSeller = catchAsync(async (req, res) => {
  const sellerId = req.params.sellerId;
  if (!sellerId) {
    return res.status(400).json({ message: 'Seller id is required' });
  }
  const orders = await Order.find({ sellerId: sellerId }).sort({_id:-1}).populate('productId').populate('user');
  res.status(200).json(orders);
});

const getAllOrders = catchAsync(async (req, res) => {
  const orders = await Order.find({}).populate('productId').sort({_id:-1}).populate('user').populate('sellerId');
  res.status(200).json(orders);
});

module.exports = {
  onBoardSeller,
  createCheckoutSession,
  getAllOrders,
  getOrderForUser,
  getOrderForSeller,
  stripeWebhook
};