const httpStatus = require('http-status');
const { Subscription } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a Subscription
 * @param {Object} SubscriptionBody
 * @returns {Promise<Subscription>}
 */
const createSubscription = async (SubscriptionBody) => {
  return Subscription.create(SubscriptionBody);
};

/**
 * Query for Subscriptions
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySubscriptions = async (filter, options) => {
  const Subscriptions = await Subscription.paginate(filter, options);
  return Subscriptions;
};

/**
 * Get Subscription by id
 * @param {ObjectId} id
 * @returns {Promise<Subscription>}
 */
const getSubscriptionById = async (id) => {
  return Subscription.findById(id);
};

/**
 * Update Subscription by id
 * @param {ObjectId} SubscriptionId
 * @param {Object} updateBody
 * @returns {Promise<Subscription>}
 */
const updateSubscriptionById = async (SubscriptionId, updateBody) => {
  const subscription = await getSubscriptionById(SubscriptionId);
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subscription not found');
  }

  Object.assign(subscription, updateBody);
  await subscription.save();
  return subscription;
};

/**
 * Delete Subscription by id
 * @param {ObjectId} SubscriptionId
 * @returns {Promise<Subscription>}
 */
const deleteSubscriptionById = async (SubscriptionId) => {
  const subscription = await getSubscriptionById(SubscriptionId);
  if (!subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subscription not found');
  }
  await subscription.remove();
  return subscription;
};

module.exports = {
  createSubscription,
  querySubscriptions,
  getSubscriptionById,
  updateSubscriptionById,
  deleteSubscriptionById,
};
