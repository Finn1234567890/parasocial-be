const { fetchYoutubeData, fetchTwitchData } = require('../utils/api-funcs.js')
const { fetchRedditData } = require('../utils/api-funcs.js')
const { creators } = require('../config/creators.js')
const { supabase } = require('../lib/supabase.js')

const setCreatorData = async () => {
    console.log('executing cron job db-population-runner...' + new Date())    


    creators.map(async ( creator, index ) => {
        const youtubeData = await fetchYoutubeData(creator.youtube);
        const redditData = await fetchRedditData(creator.reddit)
        const twitchData = await fetchTwitchData(creator.twitch)

        const { error } = await supabase
            .from("creators")
            .update({
                creator: creator.creator,
                youtube: youtubeData,
                reddit: redditData,
                twitch: twitchData,
            })
            .eq("id", index);

        if (error) console.log(error);
    })}
  
module.exports = { setCreatorData }