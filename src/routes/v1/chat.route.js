const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const chatValidation = require('../../validations/chat.validation');
const chatController = require('../../controllers/chat.contoller');

const router = express.Router();

router.route('/').post(auth('manageUsers'), validate(chatValidation.createRoom), chatController.createRoom);

module.exports = router;
