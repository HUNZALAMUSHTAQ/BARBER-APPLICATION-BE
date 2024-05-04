// routes/operatingHours.route.js

const express = require('express');
const router = express.Router();
const operatingHoursController = require('../../controllers/operatinghour.controller');
const validate = require('../../middlewares/validate');
const {
  createOperatingHoursSchema,
  updateOperatingHoursSchema,
  operatingHoursIdSchema,
  userIdSchema,
} = require('../../validations/operatinghour.validator');
const auth = require('../../middlewares/auth');

router.post('/', auth(), validate(createOperatingHoursSchema), operatingHoursController.createOperatingHours);
router.get('/:operatingHoursId', auth(), validate(operatingHoursIdSchema), operatingHoursController.getOperatingHoursById);
router.put(
  '/:operatingHoursId',
  auth(),
  validate(operatingHoursIdSchema),
  validate(updateOperatingHoursSchema),
  operatingHoursController.updateOperatingHoursById
);
router.delete(
  '/:operatingHoursId',
  auth(),
  validate(operatingHoursIdSchema),
  operatingHoursController.deleteOperatingHoursById
);
router.get('/user/:userId', auth(), validate(userIdSchema), operatingHoursController.getAllOperatingHoursByUser);

module.exports = router;
