const Apify = require("apify");
require("dotenv").config();

async function fetchTikTokVideo(hashtag) {
if(!hashtag) return null
  const apifyClient = new Apify.ApifyClient({
    token: process.env.APIFY_API_TOKEN,
  });

  const actorId = "clockworks/free-tiktok-scraper";
  const input = {
    "excludePinnedPosts": true,
    "maxProfilesPerQuery": 1,
    "searchQueries": [
        hashtag
    ],
    "searchSection": "/video",
    "shouldDownloadCovers": false,
    "shouldDownloadSlideshowImages": false,
    "shouldDownloadSubtitles": false,
    "shouldDownloadVideos": false
}
  try {
    const run = await apifyClient.actor(actorId).call(input);

    const results = await apifyClient.dataset(run.defaultDatasetId).listItems();

    const tiktokVideoData = {
      title: results.items[0].text,
      url: results.items[0].webVideoUrl,
      author: results.items[0].authorMeta.name,
      thumbnailUrl: results.items[0].videoMeta.coverUrl,
      hashtahs: results.items[0].hashtags,
    };

    console.log("Successfull TikTok API call for: ", hashtag);
    return tiktokVideoData;
  } catch (error) {
    console.log("Error running TikTok Video fetch for: " + hashtag, error);
  }
}

async function fetchXPost(searchItem) {
  const apifyClient = new Apify.ApifyClient({
    token: process.env.APIFY_API_TOKEN,
  });

  const actorId = "apidojo/tweet-scraper";
  const input = {
    includeSearchTerms: true,
    maxItems: 3,
    onlyImage: false,
    onlyQuote: false,
    onlyTwitterBlue: false,
    onlyVerifiedUsers: false,
    onlyVideo: false,
    searchTerms: [searchItem],
    sort: "Top",
    tweetLanguage: "en",
  };

  try {
    const run = await apifyClient.actor(actorId).call(input);

    await new Promise((resolve) => setTimeout(resolve, 5000));

    const results = await apifyClient.dataset(run.defaultDatasetId).listItems();
    console.log(results)

    const xPostData = {
      title: results.items[0].text,
      url: results.items[0].url,
      author: results.items[0].author.userName,
      thumbnailUrl: results.items[0].extendedEntities.media_url_https,
    };

    console.log("Successfull X API call for: ", searchItem);
    console.log(xPostData)
    return xPostData;
  } catch (error) {
    console.log("Error running X Post fetch for: " + searchItem, error);
  }
}

async function fetchInstagramPost(creator) {
    if(!creator) return null

    const apifyClient = new Apify.ApifyClient({
      token: process.env.APIFY_API_TOKEN,
    });
  
    const actorId = "apify/instagram-scraper";
    const input = {
        "addParentData": false,
        "directUrls": [
            `https://www.instagram.com/${creator}/`
        ],
        "enhanceUserSearchWithFacebookPage": false,
        "isUserReelFeedURL": false,
        "isUserTaggedFeedURL": false,
        "resultsLimit": 1,
        "resultsType": "posts",
        "searchLimit": 1,
        "searchType": "hashtag"
    }
  
    try {
      const run = await apifyClient.actor(actorId).call(input);
  
      const results = await apifyClient.dataset(run.defaultDatasetId).listItems();
 
      const InstagramPostData = {
        title: results.items[0].caption,
        url: results.items[0].url,
        author: results.items[0].ownerUsername,
        thumbnailUrl: results.items[0].images,
      };
  
      console.log("Successfull Instagram API call for: ", creator);
      return InstagramPostData;
    } catch (error) {
      console.log("Error running Instagram Post fetch for: " + creator, error);
    }
  }

module.exports = {
  fetchTikTokVideo,
  fetchXPost,
  fetchInstagramPost
};
