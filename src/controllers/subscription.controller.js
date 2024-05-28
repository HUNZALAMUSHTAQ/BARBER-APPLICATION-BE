const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { SubscriptionService } = require('../services');

const createSubscription = catchAsync(async (req, res) => {
  const Subscription = await SubscriptionService.createSubscription(req.body);
  res.status(httpStatus.CREATED).send(Subscription);
});

const getSubscriptions = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await SubscriptionService.querySubscriptions(filter, options);
  res.send(result);
});

const getSubscription = catchAsync(async (req, res) => {
  const Subscription = await SubscriptionService.getSubscriptionById(req.params.id);
  if (!Subscription) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subscription not found');
  }
  res.send(Subscription);
});

const deleteSubscription = catchAsync(async (req, res) => {
  await SubscriptionService.deleteSubscriptionById(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSubscription,
  getSubscriptions,
  getSubscription,
  deleteSubscription,
};
