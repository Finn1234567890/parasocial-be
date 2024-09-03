const { fetchYoutubeData, fetchTwitchData } = require("../utils/api-funcs.js");
const { fetchRedditData } = require("../utils/api-funcs.js");
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

module.exports = { setYouTubeCreatorData, setTwitchCreatorData, setRedditCreatorData };
