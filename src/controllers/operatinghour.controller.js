// controllers/operatingHours.controller.js

const httpStatus = require('http-status');
const OperatingHours = require('../models/operatinghours.model');
const catchAsync = require('../utils/catchAsync');

const createOperatingHours = catchAsync(async (req, res) => {
  const user = req.user.id;
  const operatingHours = await OperatingHours.create({...req.body, user});
  res.status(httpStatus.CREATED).send(operatingHours);
});

const getOperatingHoursById = catchAsync(async (req, res) => {
  const { operatingHoursId } = req.params;
  const operatingHours = await OperatingHours.findById(operatingHoursId);
  if (!operatingHours) {
    return res.status(httpStatus.NOT_FOUND).send();
  }
  res.send(operatingHours);
});

const updateOperatingHoursById = catchAsync(async (req, res) => {
  const { operatingHoursId } = req.params;
  const operatingHours = await OperatingHours.findByIdAndUpdate(operatingHoursId, req.body, { new: true });
  if (!operatingHours) {
    return res.status(httpStatus.NOT_FOUND).send();
  }
  res.send(operatingHours);
});

const deleteOperatingHoursById = catchAsync(async (req, res) => {
  const { operatingHoursId } = req.params;
  const operatingHours = await OperatingHours.findByIdAndDelete(operatingHoursId);
  if (!operatingHours) {
    return res.status(httpStatus.NOT_FOUND).send();
  }
  res.send();
});

const getAllOperatingHoursByUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const operatingHours = await OperatingHours.find({ user: userId });
  res.send(operatingHours);
});

module.exports = {
  createOperatingHours,
  getOperatingHoursById,
  updateOperatingHoursById,
  deleteOperatingHoursById,
  getAllOperatingHoursByUser
};
