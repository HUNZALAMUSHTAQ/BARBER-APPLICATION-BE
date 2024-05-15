const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Services } = require('../models');
const catchAsync = require('../utils/catchAsync');

const createService = catchAsync(async (req, res) => {
  const { description, name, price, imageUrl } = req.body;
  const user = req.user.id;

  const service = await Services.create({ user, description, name, price, imageUrl });
  res.status(httpStatus.CREATED).send(service);
});

const getServiceById = catchAsync(async (req, res) => {
  const serviceId = req.params.serviceId;

  const service = await Services.findById(serviceId);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }

  res.status(httpStatus.OK).send(service);
});

const getAllServices = catchAsync(async (req, res) => {
  const services = await Services.find();
  res.status(httpStatus.OK).send(services);
});

const getAllServicesOfUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;

  const services = await Services.find({ user: userId });
  res.status(httpStatus.OK).send(services);
});

const updateServiceById = catchAsync(async (req, res) => {
  const serviceId = req.params.serviceId;
  const userId = req.user.id;

  const service = await Services.findById(serviceId);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }

  if (service.user.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to update this service');
  }

  Object.assign(service, req.body);
  await service.save();

  res.status(httpStatus.OK).send(service);
});

const deleteServiceById = catchAsync(async (req, res) => {
  const serviceId = req.params.serviceId;
  const userId = req.user.id;

  const service = await Services.findById(serviceId);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }

  if (service.user.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to delete this service');
  }

  await service.remove();
  res.status(httpStatus.OK).send({ message: 'Service deleted successfully' });
});

module.exports = {
  createService,
  getServiceById,
  getAllServices,
  getAllServicesOfUser,
  updateServiceById,
  deleteServiceById,
};
