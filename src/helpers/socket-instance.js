/* eslint-disable radix */
const WebSocket = require('ws');

module.exports.socketInstance = (wss) => {
  try {
    const clients = [];
    const roomIds = {};

    wss.on('connection', async (ws, req) => {
      let roomId = req.url.split('?')[0];
      roomId = parseInt(roomId.match(/\d+/)[0]);

      // eslint-disable-next-line
      console.log(roomId);
      // Parse the URL and extract the query string
      const queryString = req.url.split('?')[1];

      // Parse the query string into an object using URLSearchParams
      const params = new URLSearchParams(queryString);

      // Get specific query parameters
      const userId = parseInt(params.get('userId'));
      // eslint-disable-next-line
      console.log(`Client ${userId} connected to room `, roomId);
      const roomWs = roomIds[roomId] || [];

      roomIds[roomId] = [...roomWs, ws];

      // Add the new client to the array
      clients.push(ws);

      // Event listener for receiving messages from the client
      ws.on('message', async (message) => {
        // eslint-disable-next-line
        console.log('message', message);
        const roomClients = roomIds[roomId] || [];

        if (roomClients.length) {
          // eslint-disable-next-line no-restricted-syntax
          for (const client of roomClients) {
            const index = clients.indexOf(client);

            if (index !== -1 && client !== ws && client.readyState === WebSocket.OPEN) {
              // eslint-disable-next-line
              console.log('sending message via socket', message);
              client.send(message);
            }
          }
        }
      });

      // Event listener for the client disconnecting
      ws.on('close', async (error, reason) => {
        // eslint-disable-next-line
        console.log('Client disconnected', error, JSON.parse(JSON.stringify(reason)));
        // eslint-disable-next-line
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
    // eslint-disable-next-line
    console.log(error, 'error');
    return false;
  }
};
