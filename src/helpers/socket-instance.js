/* eslint-disable*/
const WebSocket = require('ws');

const { Messages } = require('../models');

const getAllMessages = async (roomId) => {
  const messages = await Messages.find({ roomId });
  return messages;
};

const storeMessage = async (body) => {
  return await Messages.create(body);
};

module.exports.socketInstance = (wss) => {
  try {
    const clients = [];
    const roomIds = {};

    wss.on('connection', async (ws, req) => {
      let roomId = req.url.split('?')[0];
      roomId = roomId.replace(/^\//, '');
    
      console.log(roomId);
      // Parse the URL and extract the query string
      const queryString = req.url.split('?')[1];

      // Parse the query string into an object using URLSearchParams
      const params = new URLSearchParams(queryString);

      // Get specific query parameters
      const userId = params.get('userId');

      console.log(`Client ${userId} connected to room `, roomId);
      const roomWs = roomIds[roomId] || [];

      roomIds[roomId] = [...roomWs, ws];

      // Add the new client to the array
      clients.push(ws);

      /* check for messages in room */
      const messages = await getAllMessages(roomId);

      // const messages = []
      console.log('messages', messages,roomIds[roomId].length);

      /* if messages in room */
      if (messages.length && roomIds[roomId].length) {
        /* check clients in room */

        /* loop through each message */
        for (const message of messages) {
          /* loop through each client in the room and send that message to it */
          for (const client of roomIds[roomId]) {
            const index = clients.indexOf(client);

            console.log("here",message,index,client.readyState)
            if (index !== -1 && client.readyState === WebSocket.OPEN && client == ws) {
              console.log('sending message via socket', message,message?.createdAt);
              const response = {
                message:message?.message,
                userId:message?.userId,
                createdAt:message?.createdAt,
              }
              client.send(JSON.stringify(response));
            }
          }
        }
      }
      // Event listener for receiving messages from the client
      ws.on('message', async (message) => {
        console.log('message', message);
        /* store message */
        const messageInstance = await storeMessage({
          userId,
          roomId,
          message,
        });

        const response = {
          message:messageInstance?.message,
          userId:messageInstance?.userId,
          createdAt:messageInstance?.createdAt,
        }

        /* check clients in room */
        const roomClients = roomIds[roomId] || [];
        

        if (roomClients.length) {
          /* loop through each client in room */
          for (const client of roomClients) {
            const index = clients.indexOf(client);

           
            /* send message to every one in room except the sender itself */
            if (index !== -1 && client !== ws && client.readyState === WebSocket.OPEN) {
              console.log('sending message via socket', message);
              client.send(JSON.stringify(response));
            }
          }
        }
        
      });

      // Event listener for the client disconnecting
      ws.on('close', async (error, reason) => {
        console.log('Client disconnected', error, JSON.parse(JSON.stringify(reason)));

        console.log('destroy', roomId, userId);
        // Remove the disconnected client from the array
        const index = clients.indexOf(ws);
        if (index !== -1) {
          clients.splice(index, 1);
        }
      });
    });
    return true;

    // const sendMessage = send(notification);
  } catch (error) {
    console.log(error, 'error');
    return false;
  }
};
