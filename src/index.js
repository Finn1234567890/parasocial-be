const axios = require('axios')
const { setCreatorData } = require('./scripts/populateDbRunner.js')
const cron = require('node-cron')


console.log('initial start')

cron.schedule('0 5,11,17,23 * * *', () => {
	setCreatorData();
})
