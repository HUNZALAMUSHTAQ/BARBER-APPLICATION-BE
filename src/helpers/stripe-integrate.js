/* eslint-disable import/no-extraneous-dependencies */
const stripe = require('stripe');

// Initialize your Stripe client using the secret key
const stripeClient = stripe(process.env.STRIPE_KEY);

/**
 * Creates a new customer profile on Stripe.
 * @param {string} email - Email address of the new customer.
 * @returns {Promise<object>} - A Promise resolving with the newly created customer object.
 */
async function createCustomer(email) {
  try {
    // Create a new customer profile with the provided email
    const customer = await stripeClient.customers.create({
      email,
    });
    return customer;
  } catch (error) {
    // Log error if customer creation fails
    // eslint-disable-next-line no-console
    console.error('Error creating customer:', error);
    throw new Error('Failed to create customer. Please try again later.');
  }
}

/**
 * Attaches a payment method to an existing customer profile on Stripe.
 * @param {string} customerId - ID of the customer on Stripe.
 * @param {string} paymentMethodId - ID of the payment method to attach.
 * @returns {Promise<object>} - A Promise resolving with the attached payment method object.
 */
async function attachPaymentMethod(customerId, paymentMethodId) {
  try {
    // Attach the payment method to the specified customer profile
    const attachedPaymentMethod = await stripeClient.paymentMethods.attach(paymentMethodId, { customer: customerId });
    return attachedPaymentMethod;
  } catch (error) {
    // Log error if attachment fails
    // eslint-disable-next-line no-console
    console.error('Error attaching payment method:', error);
    throw new Error('Failed to attach payment method. Please try again later.');
  }
}

/**
 * Detaches a payment method from a customer's profile on Stripe.
 * @param {string} paymentMethodId - ID of the payment method to detach.
 * @returns {Promise<void>} - A Promise resolving when the detachment is successful.
 */
async function detachPaymentMethod(paymentMethodId) {
  try {
    // Detach the specified payment method from Stripe
    await stripeClient.paymentMethods.detach(paymentMethodId);
    // No need to return anything if detachment is successful
  } catch (error) {
    // Log error if detachment fails
    // eslint-disable-next-line no-console
    console.error('Error detaching payment method:', error);
    throw new Error('Failed to detach payment method. Please try again later.');
  }
}

/**
 * Creates a payment intent on Stripe.
 * @param {number} amount - Amount of the payment in cents.
 * @param {string} currency - Currency of the payment (e.g., 'usd').
 * @param {string} customerId - ID of the customer on Stripe.
 * @returns {Promise<object>} - A Promise resolving with the created payment intent object.
 */
async function createPaymentIntent(amount, currency, customerId) {
  try {
    // Create a payment intent for the specified amount and currency, linked to the customer
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
    });
    return paymentIntent;
  } catch (error) {
    // Log error if payment intent creation fails
    // eslint-disable-next-line no-console
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent. Please try again later.');
  }
}

module.exports = {
  createCustomer,
  attachPaymentMethod,
  detachPaymentMethod,
  createPaymentIntent,
};
