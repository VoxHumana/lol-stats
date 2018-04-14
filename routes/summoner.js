const express = require('express')

const router = express.Router()
const summonerController = require('../controllers/getSummoner')

router.get('/summoner/:summonerName', async (req, res) => {
  if (req.params.summonerName === undefined || req.query.region === undefined) {
    res.status(400).send({
      error: 'Invalid summoner name or region'
    })
  }
  const { summonerName } = req.params
  const { region } = req.query
  const response = await summonerController(summonerName, region)
  res.status(response.status)
  if (!response.error) {
    res.send(response.data)
  } else {
    res.send(response.error)
  }
})

module.exports = router
