const axios = require('axios')
const { getTwitchAppAccessToken } = require('../utils/api-funcs.js')
require('dotenv').config()

const getUserId = async (username) => {
    const access_token = process.env.TWITCH_APP_ACCESS_TOKEN

    try {
      const response = await axios.get('https://api.twitch.tv/helix/users', {
        params: { login: username },
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${access_token}`
        }
      });
  
      const user_id = response.data.data[0].id;
      console.log(username + "user id:", user_id)
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  getUserId('jerma985')