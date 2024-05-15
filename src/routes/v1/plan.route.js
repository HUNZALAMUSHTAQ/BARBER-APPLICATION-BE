const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const planValidation = require('../../validations/plan.validator.js');
const planController = require('../../controllers/plan.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(planValidation.createPlan), planController.createPlan)
  .get(auth(), planController.getAllPlans);

router
  .route('/:planId')
  .get(auth(), validate(planValidation.planIdParam), planController.getPlanById)
  .patch(auth(), validate(planValidation.updatePlan), planController.updatePlanById)
  .delete(auth(), validate(planValidation.planIdParam), planController.deletePlanById);

router.get('/user/:userId', validate(planValidation.userIdParam), planController.getAllPlansOfUser);

module.exports = router;
