const request = require('request-promise');

let region = 'na1';
const championStaticData = require('../static/Champions').data;
const shopItemStaticData = require('../static/ItemShop').data;
const summonerSpellsStaticData = require('../static/SummonerSpells').data;

async function getSummonerAccountId(summonerName) {
  const options = {
    uri: `https://${region}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}`,
    headers: {
      'X-Riot-Token': process.env.riot_api_key,
    },
    json: true,
  };

  const res = await request(options);
  return res.accountId;
}

async function getSummonerRecentMatches(accountId, numMatchesToFetch = 10) {
  const options = {
    uri: `https://${region}.api.riotgames.com/lol/match/v3/matchlists/by-account/${accountId}`,
    headers: {
      'X-Riot-Token': process.env.riot_api_key,
    },
    qs: {
      beginIndex: 0,
      endIndex: numMatchesToFetch,
    },
    json: true,
  };

  return request(options);
}

async function getMatchDetails(id) {
  const options = {
    uri: `https://${region}.api.riotgames.com/lol/match/v3/matches/${id}`,
    headers: {
      'X-Riot-Token': process.env.riot_api_key,
    },
    json: true,
  };

  return request(options);
}

function getSummonerParticipantId(id, participants) {
  return (participants.find(p => p.player.currentAccountId === id)).participantId;
}

async function filterMatchDetails(accountId, match) {
  const targetId = getSummonerParticipantId(accountId, match.participantIdentities);
  if (targetId == null || targetId === undefined) {
    throw new Error(`Cannot find summoner in ${match.gameId}`);
  }
  const targetPlayer = match.participants.find(p => p.participantId === targetId);
  return {
    win: targetPlayer.stats.win,
    champion: {
      name: championStaticData[targetPlayer.championId].name,
      image: championStaticData[targetPlayer.championId].image.full,
    },
    summonerSpells: {
      spell1Id: {
        name: summonerSpellsStaticData[targetPlayer.spell1Id].name,
        image: summonerSpellsStaticData[targetPlayer.spell1Id].image.full,
      },
      spell2Id: {
        name: summonerSpellsStaticData[targetPlayer.spell2Id].name,
        image: summonerSpellsStaticData[targetPlayer.spell2Id].image.full,
      },
    },
    kills: targetPlayer.stats.kills,
    deaths: targetPlayer.stats.deaths,
    assists: targetPlayer.stats.assists,
    items: {
      item0: {
        name: shopItemStaticData[targetPlayer.stats.item0].name,
        image: shopItemStaticData[targetPlayer.stats.item0].image.full,
      },
      item1: {
        name: shopItemStaticData[targetPlayer.stats.item1].name,
        image: shopItemStaticData[targetPlayer.stats.item1].image.full,
      },
      item2: {
        name: shopItemStaticData[targetPlayer.stats.item2].name,
        image: shopItemStaticData[targetPlayer.stats.item2].image.full,
      },
      item3: {
        name: shopItemStaticData[targetPlayer.stats.item3].name,
        image: shopItemStaticData[targetPlayer.stats.item3].image.full,
      },
      item4: {
        name: shopItemStaticData[targetPlayer.stats.item4].name,
        image: shopItemStaticData[targetPlayer.stats.item4].image.full,
      },
      item5: {
        name: shopItemStaticData[targetPlayer.stats.item5].name,
        image: shopItemStaticData[targetPlayer.stats.item5].image.full,
      },
    },
    trinket: {
      name: shopItemStaticData[targetPlayer.stats.item6].name,
      image: shopItemStaticData[targetPlayer.stats.item6].image.full,
    },
    cs: targetPlayer.stats.totalMinionsKilled,
    gold: targetPlayer.stats.goldEarned,
    gameDuration: match.gameDuration,
    level: targetPlayer.stats.champLevel,
  };
}

async function getSummoner(req, res) {
  if (req.params.hasOwnProperty('summonerName') && req.query.hasOwnProperty('region')) {
    const summonerName = req.params.summonerName;
    region = req.query.region;

    try {
      const accountId = await getSummonerAccountId(summonerName);
      if (!accountId) {
        res.status(400).send({ error: 'Summoner not found' });
      }

      const matchList = await getSummonerRecentMatches(accountId);
      const matches = [];
      await Promise.all(matchList.matches.map(async (m) => {
        const match = await getMatchDetails(m.gameId);
        const filteredMatchDetails = await filterMatchDetails(accountId, match);
        matches.push(filteredMatchDetails);
      }));

      res.send(matches);
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send({
      error: 'Invalid summoner name or region',
    });
  }
}

module.exports = getSummoner;
