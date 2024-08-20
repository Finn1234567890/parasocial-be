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
const { fetchYoutubeData, fetchTwitchData } = require("../utils/api-funcs.js");
const { fetchRedditData } = require("../utils/api-funcs.js");
const { supabase } = require("../lib/supabase.js");
const setCreatorData = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("executing cron job db-population-runner..." + new Date());
    const { data, error } = yield supabase.from("creators-data").select();
    if (data) {
        console.log('Checking total of ' + data.length + ' creators');
        console.log('--------------------------------------------------');
        data.map((creator, index) => __awaiter(void 0, void 0, void 0, function* () {
            const youtubeData = yield fetchYoutubeData(creator.youtube);
            const redditData = yield fetchRedditData(creator.reddit);
            const twitchData = yield fetchTwitchData(creator.twitch);
            const { error } = yield supabase
                .from("creators")
                .update({
                youtube: youtubeData,
                reddit: redditData,
                twitch: twitchData,
            })
                .eq("creator", creator.creator);
            if (error)
                console.log(error);
        }));
    }
    if (error)
        console.log(error);
});
module.exports = { setCreatorData };
