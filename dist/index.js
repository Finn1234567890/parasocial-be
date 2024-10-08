"use strict";
const axios = require('axios');
const { setCreatorData } = require('./scripts/populateDbRunner.js');
const cron = require('node-cron');
setCreatorData(); //initial run of the data base population when starting script
cron.schedule('* */2 * * *', () => {
    setCreatorData();
});
