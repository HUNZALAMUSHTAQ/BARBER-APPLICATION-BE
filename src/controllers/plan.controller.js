const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Plan } = require('../models');
const catchAsync = require('../utils/catchAsync');

const createPlan = catchAsync(async (req, res) => {
  const { description, name, price, serviceAllowed, imageUrl } = req.body;
  const user = req.user.id;

  const plan = await Plan.create({ user, description, name, price, serviceAllowed, imageUrl });
  res.status(httpStatus.CREATED).send(plan);
});

const getPlanById = catchAsync(async (req, res) => {
  const planId = req.params.planId;

  const plan = await Plan.findById(planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');
  }

  res.status(httpStatus.OK).send(plan);
});

const getAllPlans = catchAsync(async (req, res) => {
  const plans = await Plan.find();
  res.status(httpStatus.OK).send(plans);
});

const getAllPlansOfUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const plans = await Plan.find({ user: userId });
  res.status(httpStatus.OK).send(plans);
});

const updatePlanById = catchAsync(async (req, res) => {
  const planId = req.params.planId;
  const userId = req.user.id;

  const plan = await Plan.findById(planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');
  }

  Object.assign(plan, req.body);
  await plan.save();

  res.status(httpStatus.OK).send(plan);
});

const deletePlanById = catchAsync(async (req, res) => {
  const planId = req.params.planId;
  const userId = req.user.id;

  const plan = await Plan.findById(planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Plan not found');
  }

  await plan.remove();
  res.status(httpStatus.OK).send({ message: 'Plan deleted successfully' });
});

module.exports = {
  createPlan,
  getPlanById,
  getAllPlans,
  getAllPlansOfUser,
  updatePlanById,
  deletePlanById,
};
