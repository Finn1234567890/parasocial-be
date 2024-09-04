const axios = require('axios')
const { setYouTubeCreatorData, setRedditCreatorData, setTwitchCreatorData, setTikTokCreatorData, setInstagramCreatorData } = require('./scripts/populateDbRunner.js')
const cron = require('node-cron')


console.log('initial start')



cron.schedule('*/32 * * * *', () => { //every 30 minutes
	setRedditCreatorData();
})

cron.schedule('0 13 * * *', () => { 
	setTikTokCreatorData();
})

cron.schedule('0 14 * * *', () => { 
	setInstagramCreatorData();
})


cron.schedule('*/30 * * * *', () => { //every 30 minutes
	setTwitchCreatorData();
})


cron.schedule('0 5,11,17,23 * * *', () => { //every 6 hours
	setYouTubeCreatorData();
})

