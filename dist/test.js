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
require('dotenv').config();
const getTiktokAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const client_key = process.env.TIKTOK_CLIENT_KEY;
    const client_secret = process.env.TIKTOK_CLIENT_SECRET;
    const tiktok_token_url = "https://open.tiktokapis.com/v2/oauth/token/";
    const params = new URLSearchParams();
    params.append('client_key', client_key);
    params.append('client_secret', client_secret);
    params.append('grant_type', 'client_credentials');
    try {
        const response = yield axios.post(tiktok_token_url, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log(response.data);
    }
    catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
        }
        else {
            console.error('Error message:', error.message);
        }
    }
});
getTiktokAccessToken();
