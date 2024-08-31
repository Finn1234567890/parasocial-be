const { fetchYoutubeData, fetchTwitchData } = require("../utils/api-funcs.js");
const { fetchRedditData } = require("../utils/api-funcs.js");
const { supabase } = require("../lib/supabase.js");

const setCreatorData = async () => {
  console.log("executing cron job db-population-runner..." + new Date());

  const { data, error } = await supabase.from("creators-data").select();
  if (data) {
    console.log('Checking total of ' + data.length + ' creators');
    console.log('--------------------------------------------------')
    data.map(async (creator, index) => {
      const youtubeData = await fetchYoutubeData(creator.youtube);

      const redditData = await fetchRedditData(creator.reddit);
      
      const twitchData = await fetchTwitchData(creator.twitch);

      const { error } = await supabase
        .from("creators")
        .update({
          youtube: youtubeData,
          reddit: redditData,
          twitch: twitchData,
        })
        .eq("creator", creator.creator);

      if (error) console.log(error);
    });
  }
  if (error) console.log(error);

};

module.exports = { setCreatorData };
