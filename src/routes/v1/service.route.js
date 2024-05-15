const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const serviceValidation = require('../../validations/service.validations');
const serviceController = require('../../controllers/services.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(serviceValidation.createService), serviceController.createService)
  .get(auth(), serviceController.getAllServices);

router
  .route('/:serviceId')
  .get(auth(), validate(serviceValidation.serviceIdParam), serviceController.getServiceById)
  .patch(auth(), validate(serviceValidation.updateService), serviceController.updateServiceById)
  .delete(auth(), validate(serviceValidation.serviceIdParam), serviceController.deleteServiceById);

router.get('/user/:userId', validate(serviceValidation.userIdParam), serviceController.getAllServicesOfUser);

module.exports = router;
