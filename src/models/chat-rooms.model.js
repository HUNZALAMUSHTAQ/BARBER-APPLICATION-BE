const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const chatRoomSchema = mongoose.Schema(
  {
    user1: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    user2: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// add plugin that converts mongoose to json
chatRoomSchema.plugin(toJSON);

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;
