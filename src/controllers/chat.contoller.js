const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { chatService } = require('../services');

const createChatRoom = catchAsync(async (req, res) => {
  const room = await chatService.createChatRoom(req.body);
  res.status(httpStatus.CREATED).send(room);
});

module.exports = {
  createChatRoom,
};
