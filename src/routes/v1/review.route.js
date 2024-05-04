const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { reviewValidation } = require('../../validations');
const { reviewController } = require('../../controllers');

const router = express.Router();

router.route('/').post(auth(), validate(reviewValidation.createReview), reviewController.createReview);

router.delete('/:reviewId', auth(), validate(reviewValidation.deleteReview), reviewController.deleteReview);
router.put('/:reviewId', auth(), validate(reviewValidation.updateReview), reviewController.updateReviewById);

router.get(
  '/barbers/:barberId',
  auth(),
  validate(reviewValidation.getAllReviewsByBarberId),
  reviewController.getAllReviewsByBarberId
);

router.get(
    '/stats/:userId',
    auth(),
    validate(reviewValidation.userIdParam),
    reviewController.getReviewStatsByUserId
  );

// router.post('/upload/profile', auth(), userController.uploadImage);

module.exports = router;
