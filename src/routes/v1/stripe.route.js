const express = require('express');
const auth = require('../../middlewares/auth'); // Assuming middleware for authentication
const stripeValidation = require('../../validations/stripe.validation');
const validate = require('../../middlewares/validate');
const controller = require('../../controllers/stripe.controller');


const router = express.Router();

router.route('/onboard').post(auth(),  controller.onBoardSeller);
router.route('/buy-product/:productId').post(auth(),  controller.createCheckoutSession);

// router.route('/onboard').post(auth(), validate(stripeValidation.onBoard), )


module.exports = router;
