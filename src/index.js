const axios = require('axios')
const { setYouTubeCreatorData, setRedditCreatorData, setTwitchCreatorData, setTikTokCreatorData, setInstagramCreatorData } = require('./scripts/populateDbRunner.js')
const cron = require('node-cron')
const { resetUserSearches, resetUserCreates } = require('./scripts/userSearchesReset')

console.log('initial start')

cron.schedule('7 8 * * *', () => { 
	resetUserSearches();
	resetUserCreates()
})

cron.schedule('*/32 * * * *', () => { //every 30 minutes
	setRedditCreatorData();
})

cron.schedule('0 12 * * *', () => { 
	setTikTokCreatorData();
})

cron.schedule('5 14 * * *', () => { 
	setInstagramCreatorData();
}) 


cron.schedule('*/31 * * * *', () => { //every 30 minutes
	setTwitchCreatorData();
})


cron.schedule('0 5,11,17 * * *', () => { //every 6 hours
	setYouTubeCreatorData();
})

