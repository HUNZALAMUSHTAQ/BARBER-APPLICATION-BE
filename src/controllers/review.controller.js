const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const multerConfig = require('../config/multer.config');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { Review } = require('../models');
var mongoose = require('mongoose');

const createReview = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { barberId, description, stars } = req.body;
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const barber = await userService.getUserById(barberId);
  console.log(barber);
  if (!barber || barber.role !== 'barber') {
    throw new ApiError(httpStatus.NOT_FOUND, 'Barber not found or user is not a barber.');
  }

  const review = await Review.create({
    user: barberId,
    reviewBy: userId,
    description,
    stars,
  });

  res.status(httpStatus.CREATED).send(review);
});

const deleteReview = catchAsync(async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user.id;

  // Check if the review exists and if the user is authorized to delete it
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  if (review.reviewBy.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to delete this review');
  }

  await review.remove();
  res.status(httpStatus.OK).send({ message: 'Review deleted successfully.' });
});

const updateReviewById = catchAsync(async (req, res) => {
  const reviewId = req.params.reviewId;
  const review = await Review.findById(reviewId);
  const userId = req.user.id;
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  if (review.reviewBy.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to delete this review');
  }
  Object.assign(review, req.body);
  await review.save();
  res.status(httpStatus.OK).send({ message: 'Review updated successfully.', review: review });
});

const getAllReviewsByBarberId = catchAsync(async (req, res) => {
  const barberId = req.params.barberId;
  const barber = await userService.getUserById(barberId);
  if (!barber || barber.role !== 'barber') {
    throw new ApiError(httpStatus.NOT_FOUND, 'Barber not found or user is not a barber.');
  }

  const reviews = await Review.find({ user: barberId }).populate({
    path: 'reviewBy',
    select: 'name email',
  });
  res.status(httpStatus.OK).send(reviews);
});


const getReviewStatsByUserId = async (req, res) => {
    const userId = req.params.userId;
  
    const user = await userService.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'user not found.');
    }
  
    const reviewCount = await Review.countDocuments({ user: userId });
  
    const aggregateResult = await Review.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, averageStars: { $avg: '$stars' } } }
    ]);
    console.log(aggregateResult)
    const averageStars = aggregateResult.length > 0 ? aggregateResult[0].averageStars : 0;
  
    res.status(httpStatus.OK).send({ reviewCount, averageStars });
  };
module.exports = {
  createReview,
  getAllReviewsByBarberId,
  deleteReview,
  updateReviewById,
  getReviewStatsByUserId
};
