const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { chatService } = require('../services');
const { ChatRoom } = require('../models');

const createChatRoom = catchAsync(async (req, res) => {
  const room = await chatService.createChatRoom(req.body);
  res.status(httpStatus.CREATED).send(room);
});

const getAllRooms = catchAsync(async (req, res) => {
  const chatRooms = await ChatRoom.find().populate('user1').populate('user2').exec();

  res.status(httpStatus.OK).send(chatRooms);
});

const getAllRoomOfUserById = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const chatRooms = await ChatRoom.find({
    $or: [{ user1: userId }, { user2: userId }],
  })
    .populate('user1')
    .populate('user2')
    .exec();

  res.status(httpStatus.OK).send(chatRooms);
});
module.exports = {
  createChatRoom,
  getAllRooms,
  getAllRoomOfUserById
};
