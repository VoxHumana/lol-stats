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
  const { championId, spell1Id, spell2Id } = targetPlayer;
  const {
    kills, deaths, assists,
    item0, item1, item2, item3, item4, item5, item6,
    totalMinionsKilled, goldEarned, champLevel,
  } = targetPlayer.stats;
  return {
    win: targetPlayer.stats.win,
    champion: {
      name: championStaticData[championId].name,
      image: championStaticData[championId].image.full,
    },
    summonerSpells: [
      {
        name: summonerSpellsStaticData[spell1Id].name,
        image: summonerSpellsStaticData[spell1Id].image.full,
      },
      {
        name: summonerSpellsStaticData[spell2Id].name,
        image: summonerSpellsStaticData[spell2Id].image.full,
      },
    ],
    kills,
    deaths,
    assists,
    items: [
      {
        name: shopItemStaticData[item0].name,
        image: shopItemStaticData[item0].image.full,
      },
      {
        name: shopItemStaticData[item1].name,
        image: shopItemStaticData[item1].image.full,
      },
      {
        name: shopItemStaticData[item2].name,
        image: shopItemStaticData[item2].image.full,
      },
      {
        name: shopItemStaticData[item3].name,
        image: shopItemStaticData[item3].image.full,
      },
      {
        name: shopItemStaticData[item4].name,
        image: shopItemStaticData[item4].image.full,
      },
      {
        name: shopItemStaticData[item5].name,
        image: shopItemStaticData[item5].image.full,
      },
    ],
    trinket: {
      name: shopItemStaticData[item6].name,
      image: shopItemStaticData[item6].image.full,
    },
    cs: totalMinionsKilled,
    gold: goldEarned,
    gameDuration: match.gameDuration,
    level: champLevel,
  };
}

async function getSummoner(req, res) {
  if (req.params.summonerName !== undefined && req.query.region !== undefined) {
    const { summonerName } = req.params;
    ({ region } = req.query);

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
