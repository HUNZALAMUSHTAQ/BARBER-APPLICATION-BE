const express = require('express');
const auth = require('../../middlewares/auth'); // Assuming middleware for authentication
const stripeValidation = require('../../validations/stripe.validation');
const validate = require('../../middlewares/validate');
const controller = require('../../controllers/stripe.controller');


const router = express.Router();

router.route('/onboard').post(auth(),  controller.onBoardSeller);
router.route('/buy-product/:productId').post(auth(), validate(stripeValidation.purchaseItem) ,controller.createCheckoutSession);
router.route('/user-orders').get(auth(), controller.getOrderForUser);
router.route('/seller-orders/:sellerId').get(auth(), controller.getOrderForSeller);
router.route('/all-orders').get(auth(), controller.getAllOrders);

module.exports = router;
