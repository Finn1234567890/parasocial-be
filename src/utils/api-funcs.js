const axios = require("axios");
const qs = require('qs')
const { calcTimeAgo } = require("./util-funcs.js")
require("dotenv").config();


// Function to get access token
const getRedditAccessToken = async () => {
  const tokenUrl = 'https://www.reddit.com/api/v1/access_token';
  const credentials = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64');

  const data = qs.stringify({
    grant_type: 'password',
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
  });

  const headers = {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const response = await axios.post(tokenUrl, data, { headers });
    return response.data.access_token;
  } catch (error) {
    console.error('Error obtaining access token:', error.response.data);
    throw new Error('Failed to obtain access token');
  }
};

//function to get tiktok client access token
const getTiktokAccessToken = async () => {
  const client_key = process.env.TIKTOK_CLIENT_KEY;
  const client_secret = process.env.TIKTOK_CLIENT_SECRET;
  const tiktok_token_url = "https://open.tiktokapis.com/v2/oauth/token/";

  const params = new URLSearchParams();
  params.append("client_key", client_key);
  params.append("client_secret", client_secret);
  params.append("grant_type", "client_credentials");

  try {
    const response = await axios.post(tiktok_token_url, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data.access_token;
  } catch (error) {
    if (error.response) {
      console.error(
        "Error response when getting tiktok access token:",
        error.response.data
      );
    } else {
      console.error(
        "Error message when getting tiktok access token:",
        error.message
      );
    }
  }
};

//function to get twitch app access toke required for api requests
const getTwitchAppAccessToken = async () => {
  const client_id = process.env.TWITCH_CLIENT_ID;
  const client_secret = process.env.TWITCH_CLIENT_SECRET;
  const twitch_token_url = "https://id.twitch.tv/oauth2/token";

  try {
    const response = await axios.post(twitch_token_url, null, {
      params: {
        client_id: client_id,
        client_secret: client_secret,
        grant_type: "client_credentials",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const accessToken = response.data.access_token;
    console.log("Access Token:", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
  }
};

const fetchYoutubeData = async (channelId) => {
  const key = 'AIzaSyDAkEd_GkB5hiD4Y4fmAnkqCNqSU6bchCw';

  try {
    const videoResponse = await axios.get(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=1&order=date&key=${key}`
    ); //fetching youtube api video data
    const videoData = videoResponse.data.items[0];

    const videoUrl = `https://www.youtube.com/watch?v=${videoData.id.videoId}`;

    const timeAgo = calcTimeAgo(videoData.snippet.publishedAt, 'iso')

    const videoDetails = {
      videoUrl: videoUrl,
      title: videoData.snippet.title,
      thumbnailUrl: videoData.snippet.thumbnails.high.url,
      channelName: videoData.snippet.channelTitle,
      created: timeAgo,
    };

    console.log(
      "Successful Youtube API call for " +
        videoDetails.channelName 
    );
    return videoDetails;
  } catch (error) {
    console.error(
      "Error fetching the latest Youtube video:" + channelId,
      error
    );
  }
};

const fetchRedditData = async (subredditName) => {
  try {
    const token = await getRedditAccessToken();

    const headers = {
      Authorization: `Bearer ${token}`,
      'User-Agent': `subbit/1.0 by ${process.env.REDDIT_USERNAME}`,
    };

    // Fetch the top 10 hot posts to have more posts to choose from
    const response = await axios.get(
      `https://oauth.reddit.com/r/${subredditName}/hot?limit=10`,
      { headers }
    );

    // Find the first post that is not a community highlight
    const hottestPost = response.data.data.children
      .map(post => post.data)
      .find(post => !post.stickied); // Assuming community highlights are stickied

    if (!hottestPost) {
      throw new Error('No valid hottest post found');
    }

    let thumbnailUrl = '';
    if (hottestPost.preview && hottestPost.preview.images) {
      const highestRes = hottestPost.preview.images[0].resolutions.length - 1;
      thumbnailUrl = hottestPost.preview.images[0].resolutions[highestRes].url;

      // Decode the URL and replace HTML entities
      thumbnailUrl = decodeURIComponent(thumbnailUrl).replace(/&amp;/g, '&');
    }
    // Store information of the hottest Reddit post as an object
    const postDetails = {
      title: hottestPost.title,
      url: "https://www.reddit.com" + hottestPost.permalink,
      text: hottestPost.selftext,
      thumbnail: thumbnailUrl,
      author: hottestPost.author,
      subreddit: hottestPost.subreddit,
      created: timeAgo,
    };

    console.log("Successful Reddit API call for " + subredditName);
    return postDetails; // Return the post details object
  } catch (error) {
    console.log("Error fetching data from Reddit API for subreddit: " + subredditName, error.message);
  }
};



const fetchTwitchData = async (userId) => {
  if (userId === null) {
    console.log("no twitch id supplied for this creator");
    return null;
  }
  const accessToken = process.env.TWITCH_APP_ACCESS_TOKEN;

  try {
    const response = await axios.get("https://api.twitch.tv/helix/streams", {
      params: { user_id: userId },
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    let data = response.data.data[0];
    let streamDetails;

    console.log(
      "Successful Twitch API call for " + userId 
    );

    if (data === undefined) {
      //this means the streamer is currently not live
      data = await fetchTwitchBroadcast(userId);
  

      if (data) {
        const thumbnailUrl = data.thumbnail_url
          .replace('%{width}', '1920')
          .replace('%{height}', '1080');

          

        streamDetails = {
          creator: data.user_name,
          url: data.url, //ony exists on broadcast
          title: data.title,
          game: data.game_name, //TODO: not working properly
          type: data.type,
          thumbnail: thumbnailUrl,
          duration: data.duration, //only exists on broadcast
        };

      } else {
        console.log(
          userId +
            " does not seem to have any relevant data on twitch at the moment"
        );
      }
    } else {
      const thumbnailUrl = data.thumbnail_url
      .replace('{width}', '1920')
      .replace('{height}', '1080');
    

    
    streamDetails = {
      creator: data.user_name,
      url: `https://www.twitch.tv/${data.user_name}`, //only exists on broadcast
      title: data.title,
      game: null,
      type: data.type,
      thumbnail: thumbnailUrl,
      duration: null, //only exists on broadcast
    }; 
    }

    return streamDetails;
  } catch (error) {
    console.error("Error fetching user stream from user id:" + userId, error);
  }
};

const fetchTwitchBroadcast = async (userId) => {
  try {
    const response = await axios.get("https://api.twitch.tv/helix/videos", {
      params: { user_id: userId, type: "archive", sort: "time" },
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${process.env.TWITCH_APP_ACCESS_TOKEN}`,
      },
    });

    return response.data.data[0];
  } catch (error) {
    console.error("Error fetching user broadcast:", error);
  }
};

module.exports = {
  getTwitchAppAccessToken,
  fetchRedditData,
  fetchYoutubeData,
  fetchTwitchData,
};
