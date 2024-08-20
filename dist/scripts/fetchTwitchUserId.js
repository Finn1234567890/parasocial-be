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
const axios = require('axios');
const { getTwitchAppAccessToken } = require('../utils/api-funcs.js');
require('dotenv').config();
const getUserId = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = process.env.TWITCH_APP_ACCESS_TOKEN;
    try {
        const response = yield axios.get('https://api.twitch.tv/helix/users', {
            params: { login: username },
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${access_token}`
            }
        });
        const user_id = response.data.data[0].id;
        console.log(username + "user id:", user_id);
    }
    catch (error) {
        console.error('Error fetching user ID:', error);
    }
});
getUserId('jerma985');
