// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require('axios');

// Initialize OneSignal client
module.exports.sendNotification = async (content) => {
  try {
    const { notificationMessage } = JSON.parse(content);

    const notification = {
      app_id: process.env.NOTIFICATION_APP_ID,
      contents: { en: notificationMessage },

      headings: { en: 'New message' },
      included_segments: ['include_player_ids'],
      //   include_player_ids: include_player_ids,
      content_avaliable: true,
      small_icon: 'ic_notification_icon',
      data: {
        PushTitle: notificationMessage,
        notificationType: 'message',
      },
    };
    // Set the OneSignal API endpoint URL
    const url = 'https://onesignal.com/api/v1/notifications';

    // Set the OneSignal REST API key in the headers
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Basic ${process.env.NOTIFICATION_APP_TOKEN}`,
    };

    // Make the POST request to the OneSignal API
    axios
      .post(url, notification, { headers })
      .then((response) => {
        // eslint-disable-next-line
        console.log('Notification sent successfully!');
        // eslint-disable-next-line
        console.log(response.data);
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error('Error sending notification:', error.message);
      });

    return true;
  } catch (error) {
    // eslint-disable-next-line
    console.log(error, 'error');
    return false;
  }
};
