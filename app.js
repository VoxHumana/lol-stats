const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const summoner = require('./routes/summoner')

const app = express()

const isProduction = process.env.NODE_ENV === 'production'

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'client/build')))

app.use('/summoner/:summonerName', summoner)

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
