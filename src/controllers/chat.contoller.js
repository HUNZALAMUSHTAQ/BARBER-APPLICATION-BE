const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { chatService } = require('../services');

const createChatRoom = catchAsync(async (req, res) => {
  const room = await chatService.createChatRoom(req.body);
  res.status(httpStatus.CREATED).send(room);
});

const addUserToChatRoom = catchAsync(async (req, res) => {
  const { roomId, userId } = req.body;
  const updatedRoom = await chatService.addUserToChatRoom(roomId, userId);
  res.status(httpStatus.OK).send(updatedRoom);
});

module.exports = {
  createChatRoom,
  addUserToChatRoom,
};
