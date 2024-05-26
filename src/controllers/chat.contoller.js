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

const getAllChatRooms = catchAsync(async (req, res) => {
  const rooms = await chatService.getAllChatRooms();
  res.status(httpStatus.OK).send(rooms);
});
module.exports = {
  createChatRoom,
  addUserToChatRoom,
  getAllChatRooms
};
