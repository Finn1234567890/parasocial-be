const axios = require('axios')
const { setCreatorData } = require('./scripts/populateDbRunner.js')
const cron = require('node-cron')



setCreatorData()  //initial run of the data base population when starting script

console.log('initial start')

setInterval(() => {
  const date = new Date()
  console.log('_______________')
  console.log('interval at', date)
}, 60 * 1000)

setInterval(() => {
  setCreatorData()
}, 6 * 60 * 60 * 1000)

