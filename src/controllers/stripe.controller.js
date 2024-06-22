const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { User, Product } = require('../models');
const catchAsync = require('../utils/catchAsync');
const Stripe = require('stripe');
const config = require('../config/config');

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
        refresh_url: 'https://app.behobbyist.com/',
        return_url: 'https://app.behobbyist.com/',
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
      refresh_url: 'https://abc.com/',
      return_url: 'https://abc.com/',
      type: 'account_onboarding',
    });

  await User.findOneAndUpdate({ _id: userId }, { stripeId: account.id });

  res.status(httpStatus.OK).json({url: accountLink.url});
});

const createCheckoutSession = catchAsync(async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const productId = req.params.productId;
    if (!productId) {
      return res.status(400).json({ message: 'Product id is required' });
    };

    const product = await Product.findById(productId).populate('user');
    const amount = Number(product.price);
    const platformFee = Math.round(amount * 0.10);
    const paymentMode = 'payment';
    const recurringSchedule = 'monthly';
    paymentObject = {
      customer_email: user.email,
      mode: paymentMode,
      success_url: 'https://abc.com/success',
      cancel_url: 'https://app.behobbyist.com/goBack',
      metadata: {
        userId: user._id.toString(),
        productId: productId,
        platformFee: platformFee,
        totalAmount: amount,
        productType: paymentMode,
        sellerId: product.user._id.toString(),
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
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
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
        }
      },
    };
    // const paymentIntent = await stripe.paymentIntents.create(paymentObject);
    const session = await stripe.checkout.sessions.create(paymentObject);
    return res.status(200).json({ url: session?.url, id: session?.id });
  } catch (error) {
    return res.status(500).json({ message: 'Error in creating checkout session', error: error });
  }
});

module.exports = {
  onBoardSeller,
  createCheckoutSession
};