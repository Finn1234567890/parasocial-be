const { fetchYoutubeData } = require('../utils/api-funcs.js')
const { fetchRedditData } = require('../utils/api-funcs.js')
const { creators } = require('../config/creators.js')
const { supabase } = require('../lib/supabase.js')

const setCreatorData = async () => {
    
    creators.map(async ( creator, index ) => {
        const youtubeData = await fetchYoutubeData(creator.youtube);
        const redditData = await fetchRedditData(creator.reddit)

        const { error } = await supabase
            .from("creators")
            .update({
                youtube: youtubeData,
                reddit: redditData,
            })
            .eq("id", index);

        if (error) console.log(error);
    })}
  
module.exports = { setCreatorData }