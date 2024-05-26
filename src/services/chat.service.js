const { ChatRoom } = require('../models');

/**
 * Get all chat rooms with user count
 * @returns {Promise<Array>}
 */
const getAllChatRooms = async () => {
  const rooms = await ChatRoom.find()
  return rooms;
};
/**
 * Create a chatroom
 * @param {Object} chatRoomBody - Contains an array of user IDs
 * @returns {Promise<ChatRoom>}
 */
const createChatRoom = async (chatRoomBody) => {
  const { users } = chatRoomBody;

  // Check if a chat room exists with the exact same set of users
  let chatRoom = await ChatRoom.findOne({
    users: { $all: users, $size: users.length }
  });

  // If no chat room exists, create a new one
  if (!chatRoom) {
    chatRoom = await ChatRoom.create({ users });
  }

  // Return the chat room
  return chatRoom;
};

/**
 * Add a user to an existing chat room
 * @param {string} roomId
 * @param {string} userId
 * @returns {Promise<ChatRoom>}
 */
const addUserToChatRoom = async (roomId, userId) => {
  const chatRoom = await ChatRoom.findByIdAndUpdate(
    roomId,
    { $addToSet: { users: userId } }, // Prevent duplicates
    { new: true } // Return the updated document
  );
  return chatRoom;
};

module.exports = {
  createChatRoom,
  addUserToChatRoom,
  getAllChatRooms
};
