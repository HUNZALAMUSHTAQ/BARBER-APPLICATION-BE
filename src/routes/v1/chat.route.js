const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const chatValidation = require('../../validations/chat.validation');
const chatController = require('../../controllers/chat.contoller');

const router = express.Router();

router.route('/').post(auth(), validate(chatValidation.createRoom), chatController.createChatRoom);
router.route('/rooms').get(auth(), chatController.getAllRooms);
router.route('/rooms/:userId').get(auth(), chatController.getAllRoomOfUserById);

module.exports = router;
