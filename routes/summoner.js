const express = require('express');

const router = express.Router();
const summonerController = require('../controller/getSummoner');

/* GET users listing. */
router.get('/summoner/:summonerName', summonerController);

module.exports = router;
