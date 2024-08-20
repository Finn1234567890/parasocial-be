"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const axios = require("axios");
require("dotenv").config();
const currentDate = new Date();
//function to get tiktok client access token
const getTiktokAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const client_key = process.env.TIKTOK_CLIENT_KEY;
    const client_secret = process.env.TIKTOK_CLIENT_SECRET;
    const tiktok_token_url = "https://open.tiktokapis.com/v2/oauth/token/";
    const params = new URLSearchParams();
    params.append("client_key", client_key);
    params.append("client_secret", client_secret);
    params.append("grant_type", "client_credentials");
    try {
        const response = yield axios.post(tiktok_token_url, params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return response.data.access_token;
    }
    catch (error) {
        if (error.response) {
            console.error("Error response when getting tiktok access token:", error.response.data);
        }
        else {
            console.error("Error message when getting tiktok access token:", error.message);
        }
    }
});
//function to get twitch app access toke required for api requests
const getTwitchAppAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const client_id = process.env.TWITCH_CLIENT_ID;
    const client_secret = process.env.TWITCH_CLIENT_SECRET;
    const twitch_token_url = "https://id.twitch.tv/oauth2/token";
    try {
        const response = yield axios.post(twitch_token_url, null, {
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
    }
    catch (error) {
        console.error("Error fetching access token:", error);
    }
});
const fetchYoutubeData = (channelId) => __awaiter(void 0, void 0, void 0, function* () {
    const key = "AIzaSyBzlGDjJqAYuxLahs2l3Bshk87ELTgvAR0";
    try {
        const videoResponse = yield axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=1&order=date&key=${key}`); //fetching youtube api video data
        const videoData = videoResponse.data.items[0];
        const videoUrl = `https://www.youtube.com/watch?v=${videoData.id.videoId}`;
        const videoDetails = {
            videoUrl: videoUrl,
            title: videoData.snippet.title,
            thumbnailUrl: videoData.snippet.thumbnails.high.url,
            channelName: videoData.snippet.channelTitle,
        };
        console.log("Successful Youtube API call for " +
            videoDetails.channelName +
            " at " +
            currentDate);
        return videoDetails;
    }
    catch (error) {
        console.error("Error fetching the latest Youtube video:" + channelId, error);
    }
});
const fetchRedditData = (subredditName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const redditEndpoint = "https://www.reddit.com/";
        const subredditEndpoint = `r/${subredditName}/`;
        const params = {
            sort: "top", // sort by top posts
            t: "day", // within the last day
            limit: 1, // limit to 1 result (the hottest post)
        };
        // Make GET request to Reddit API
        const response = yield axios.get(`${redditEndpoint}${subredditEndpoint}top.json`, {
            params: params,
        });
        // Extract the hottest post from the response
        const hottestPost = response.data.data.children[0].data;
        // Determine the best thumbnail URL
        let thumbnailUrl = hottestPost.thumbnail;
        // Check for a better image in the preview field
        if (hottestPost.preview && hottestPost.preview.images.length > 0) {
            const highestRes = hottestPost.preview.images[0].resolutions.length - 1;
            thumbnailUrl = hottestPost.preview.images[0].resolutions[highestRes].url;
            thumbnailUrl = decodeURIComponent(thumbnailUrl);
            // Replace HTML entities like &amp; with &
            thumbnailUrl = thumbnailUrl.replace(/&amp;/g, '&');
        }
        // Decode the URL if necessary
        // Store information of latest reddit post as an object
        const postDetails = {
            title: hottestPost.title,
            url: "https://www.reddit.com" + hottestPost.permalink,
            thumbnail: thumbnailUrl,
            author: hottestPost.author,
            subreddit: hottestPost.subreddit,
        };
        console.log("Successful Reddit API call for " + subredditName + " at " + new Date().toLocaleString());
        return postDetails;
    }
    catch (error) {
        console.error("Error fetching data from Reddit API for :" + subredditName, error);
    }
});
const fetchTwitchData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (userId === null) {
        console.log("no twitch id supplied for this creator");
        return null;
    }
    const accessToken = process.env.TWITCH_APP_ACCESS_TOKEN;
    try {
        const response = yield axios.get("https://api.twitch.tv/helix/streams", {
            params: { user_id: userId },
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${accessToken}`,
            },
        });
        let data = response.data.data[0];
        let streamDetails;
        console.log("Successful Twitch API call for " + userId + " at " + currentDate);
        if (data === undefined) {
            //this means the streamer is currently not live
            data = yield fetchTwitchBroadcast(userId);
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
            }
            else {
                console.log(userId +
                    " does not seem to have any relevant data on twitch at the moment");
            }
        }
        else {
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
    }
    catch (error) {
        console.error("Error fetching user stream from user id:" + userId, error);
    }
});
const fetchTwitchBroadcast = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios.get("https://api.twitch.tv/helix/videos", {
            params: { user_id: userId, type: "archive", sort: "time" },
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                Authorization: `Bearer ${process.env.TWITCH_APP_ACCESS_TOKEN}`,
            },
        });
        return response.data.data[0];
    }
    catch (error) {
        console.error("Error fetching user broadcast:", error);
    }
});
module.exports = {
    getTwitchAppAccessToken,
    fetchRedditData,
    fetchYoutubeData,
    fetchTwitchData,
};
