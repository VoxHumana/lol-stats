const makeAccountIdService = require('./services/accountIdService')
const makeMatchDetailsService = require('./services/matchDetailsService')
const makeRecentMatchesService = require('./services/recentMatchesService')
const makeCacheService = require('./services/staticCacheService')
const makeMemCacheServce = require('./services/memCacheService')

const Item = require('./models/static/item')
const Spell = require('./models/static/spell')
const Champion = require('./models/static/champion')

const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const redisClient = require('async-redis').createClient(process.env.REDISCLOUD_URL, {no_ready_check: true})

const summonerController = require('./controllers/getSummoner')

const accountIdService = makeAccountIdService()
const matchDetailsService = makeMatchDetailsService()
const recentMatchesService = makeRecentMatchesService()
const cacheService = makeCacheService({Item, Spell, Champion})
const memCacheService = makeMemCacheServce(redisClient)

const app = express()

const isProduction = process.env.NODE_ENV === 'production'

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'client/build')))

mongoose.connect(process.env.MONGODB_URI)
let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('MongoDB connection successful')
  cacheService.initStaticCache()
  console.log('Static cache populated')
})

redisClient.on('connect', () => {
  console.log('Redis connection successful')
})

app.get('/summoner/:summonerName', async (req, res) => {
  if (req.params.summonerName === undefined || req.query.region === undefined) {
    res.status(400).send({
      error: 'Invalid summoner name or region'
    })
  }
  const { summonerName } = req.params
  const { region } = req.query
  const options = {
    accountIdService,
    recentMatchesService,
    matchDetailsService,
    cacheService,
    memCacheService
  }
  const response = await summonerController(summonerName, region, options)
  res.status(response.status)
  if (!response.error) {
    res.send(response.data)
  } else {
    res.send(response.error)
  }
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use((err, req, res) => {
  if (!isProduction) {
    console.log(err.stack)
  }

  res.status(err.status || 500)
  res.json({
    errors: {
      message: err.message,
      error: isProduction ? {} : err
    }
  })
})

module.exports = app
