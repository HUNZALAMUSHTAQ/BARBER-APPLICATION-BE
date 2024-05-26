const WebSocket = require('ws');
const { Messages } = require('../models');

/**
 * Retrieve all messages for a specific room
 * @param {string} roomId
 * @returns {Promise<Array>}
 */
const getAllMessages = async (roomId) => {
  return await Messages.find({ roomId });
};

/**
 * Store a new message in the database
 * @param {Object} body
 * @returns {Promise<Message>}
 */
const storeMessage = async (body) => {
  return await Messages.create(body);
};

/**
 * Set up WebSocket server instance
 * @param {WebSocket.Server} wss
 */
module.exports.socketInstance = (wss) => {
  try {
    const clients = {};
    const roomIds = {};

    wss.on('connection', async (ws, req) => {
      const roomId = req.url.split('?')[0].replace(/^\//, '');
      const queryString = req.url.split('?')[1];
      const params = new URLSearchParams(queryString);
      const userId = params.get('userId');

      console.log(`Client ${userId} connected to room ${roomId}`);
      if (!roomIds[roomId]) {
        roomIds[roomId] = [];
      }
      roomIds[roomId].push(ws);

      if (!clients[userId]) {
        clients[userId] = [];
      }
      clients[userId].push(ws);

      // Fetch and send existing messages to the newly connected client
      const messages = await getAllMessages(roomId);
      for (const message of messages) {
        ws.send(JSON.stringify({
          message: message.message,
          userId: message.userId,
          createdAt: message.createdAt,
        }));
      }

      // Event listener for receiving messages from the client
      ws.on('message', async (message) => {
        const messageInstance = await storeMessage({ userId, roomId, message });
        const response = {
          message: messageInstance.message,
          userId: messageInstance.userId,
          createdAt: messageInstance.createdAt,
        };

        // Broadcast the message to all clients in the room
        for (const client of roomIds[roomId]) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(response));
          }
        }
      });

      // Event listener for the client disconnecting
      ws.on('close', () => {
        roomIds[roomId] = roomIds[roomId].filter(client => client !== ws);
        clients[userId] = clients[userId].filter(client => client !== ws);
        console.log(`Client ${userId} disconnected from room ${roomId}`);
      });
    });

    return true;
  } catch (error) {
    console.error('WebSocket error:', error);
    return false;
  }
};
