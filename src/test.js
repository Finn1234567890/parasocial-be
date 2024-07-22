const axios = require('axios')
require('dotenv').config()

const getTiktokAccessToken = async () => {
  const client_key = process.env.TIKTOK_CLIENT_KEY;
  const client_secret = process.env.TIKTOK_CLIENT_SECRET;
  const tiktok_token_url = "https://open.tiktokapis.com/v2/oauth/token/";

  const params = new URLSearchParams();
  params.append('client_key', client_key);
  params.append('client_secret', client_secret);
  params.append('grant_type', 'client_credentials');

  try {
    const response = await axios.post(tiktok_token_url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log(response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }
  }
};

getTiktokAccessToken();