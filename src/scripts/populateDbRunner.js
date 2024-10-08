const { fetchYoutubeData, fetchTwitchData } = require("../utils/api-funcs.js");
const { fetchRedditData } = require("../utils/api-funcs.js");
const { fetchInstagramPost, fetchTikTokVideo } = require("../utils/apify-funcs.js")
const { supabase } = require("../lib/supabase.js");

const setYouTubeCreatorData = async () => {
  console.log("executing cron job YouTube data population at " + new Date());

  const { data, error } = await supabase.from("creators-data").select();
  if (data) {
    console.log('Checking total of ' + data.length + ' creators');
    console.log('--------------------------------------------------')
    data.map(async (creator, index) => {
      const youtubeData = await fetchYoutubeData(creator.youtube);
      const { error } = await supabase
        .from("creators")
        .update({
          youtube: youtubeData
        })
        .eq("creator", creator.creator);

      if (error) console.log(error);
    });
  }
  if (error) console.log(error);

};

const setInstagramCreatorData = async () => {
  console.log("executing cron job Instagram data population at " + new Date());

  const { data, error } = await supabase.from("creators-data").select();
  if (data) {
    console.log('Checking total of ' + data.length + ' creators');
    console.log('--------------------------------------------------')
    data.map(async (creator, index) => {
      const instagramData = await fetchInstagramPost(creator.instagram);
      const { error } = await supabase
        .from("creators")
        .update({
          instagram: instagramData
        })
        .eq("creator", creator.creator);

      if (error) console.log(error);
    });
  }
  if (error) console.log(error);

};

const setTwitchCreatorData = async () => {
  console.log("executing cron job Twitch data population at " + new Date());

  const { data, error } = await supabase.from("creators-data").select();
  if (data) {
    console.log('Checking total of ' + data.length + ' creators');
    console.log('--------------------------------------------------')
    data.map(async (creator, index) => {

      const twitchData = await fetchTwitchData(creator.twitch);

      const { error } = await supabase
        .from("creators")
        .update({
          twitch: twitchData,
        })
        .eq("creator", creator.creator);

      if (error) console.log(error);
    });
  }
  if (error) console.log(error);

};

const setRedditCreatorData = async () => {
  console.log("executing cron job Reddit data population at " + new Date());

  const { data, error } = await supabase.from("creators-data").select();
  if (data) {
    console.log('Checking total of ' + data.length + ' creators');
    console.log('--------------------------------------------------')
    data.map(async (creator, index) => {

      const redditData = await fetchRedditData(creator.reddit);
      

      const { error } = await supabase
        .from("creators")
        .update({
          reddit: redditData,
        })
        .eq("creator", creator.creator);

      if (error) console.log(error);
    });
  }
  if (error) console.log(error);

};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const setTikTokCreatorData = async () => {
  console.log("Executing cron job TikTok data population at " + new Date());

  const { data, error } = await supabase.from("creators-data").select();
  if (data) {
    console.log("Checking total of " + data.length + " creators");
    console.log("--------------------------------------------------");

    // Process each creator sequentially with a 10-second delay
    for (const creator of data) {
      // Fetch TikTok data after waiting for 10 seconds
      await delay(10000);

      try {
        const tiktokData = await fetchTikTokVideo(creator.tiktok);

        const { error: updateError } = await supabase
          .from("creators")
          .update({
            tiktok: tiktokData,
          })
          .eq("creator", creator.creator);

        if (updateError) {
          console.log("Error updating creator:", creator.creator, updateError);
        } else {
          console.log("Successfully updated TikTok data for:", creator.creator);
        }
      } catch (err) {
        console.log("Error fetching TikTok data for:", creator.creator, err);
      }
    }
  }

  if (error) console.log(error);
};


module.exports = { setYouTubeCreatorData, setTwitchCreatorData, setRedditCreatorData, setInstagramCreatorData, setTikTokCreatorData };
