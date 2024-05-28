const express = require('express');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const SubscriptionValidation = require('../../validations/subscription.validation');
const SubscriptionController = require('../../controllers/subscription.controller');

const router = express.Router();

router.route('/').post(validate(SubscriptionValidation.createSubscription), SubscriptionController.createSubscription);
// .get(validate(SubscriptionValidation.getSubscriptions), SubscriptionController.getSubscriptions);

// router
//   .route('/:id')
//   .get(auth('getSubscriptions'), validate(SubscriptionValidation.getSubscription), SubscriptionController.getSubscription)
//   .patch(
//     auth('manageSubscriptions'),
//     validate(SubscriptionValidation.updateSubscription),
//     SubscriptionController.updateSubscription
//   )
//   .delete(
//     auth('manageSubscriptions'),
//     validate(SubscriptionValidation.deleteSubscription),
//     SubscriptionController.deleteSubscription
//   );

module.exports = router;
