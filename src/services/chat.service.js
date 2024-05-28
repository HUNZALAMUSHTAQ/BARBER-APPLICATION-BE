// const httpStatus = require('http-status');
const { ChatRoom } = require('../models');
// const ApiError = require('../utils/ApiError');

/**
 * Create a chatroom
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createChatRoom = async (userBody) => {
  const { user1, user2 } = userBody;

  // Check if a chat room exists between the two users
  let chatRoom = await ChatRoom.findOne({
    $or: [
      { user1, user2 },
      { user1: user2, user2: user1 },
    ],
  });

  // If no chat room exists, create a new one
  if (!chatRoom) {
    chatRoom = await ChatRoom.create({ user1, user2 });
  }

  // Return the chat room ID
  return chatRoom;
};

module.exports = {
  createChatRoom,
};
