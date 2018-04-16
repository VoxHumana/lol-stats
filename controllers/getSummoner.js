const getAccountId = require('../services/accountIdService')
const getRecentMatches = require('../services/recentMatchesService')
const getMatchDetails = require('../services/matchDetailsService')
const cacheService = require('../services/staticCacheService')

const championStaticData = require('../static/Champions').data
const shopItemStaticData = require('../static/ItemShop').data
const summonerSpellsStaticData = require('../static/SummonerSpells').data

function getSummonerParticipantId (id, participants) {
  return (participants.find(p => p.player.currentAccountId === id)).participantId
}

async function filterMatchDetails (accountId, match) {
  const targetId = getSummonerParticipantId(accountId, match.participantIdentities)
  if (targetId == null || targetId === undefined) {
    throw new Error(`Cannot find summoner in ${match.gameId}`)
  }
  const targetPlayer = match.participants.find(p => p.participantId === targetId)
  const { 
    championId,
    spell1Id,
    spell2Id
  } = targetPlayer
  const {
    win,
    kills,
    deaths,
    assists,
    item0,
    item1,
    item2,
    item3,
    item4,
    item5,
    item6,
    totalMinionsKilled,
    goldEarned,
    champLevel
  } = targetPlayer.stats

  let champ = await cacheService.getChampion(championId)
  let spell1 = await cacheService.getSpell(spell1Id)
  let spell2 = await cacheService.getSpell(spell2Id)
  let firstItem = await cacheService.getItem(item0)
  let secondItem = await cacheService.getItem(item1)
  let thirdItem = await cacheService.getItem(item2)
  let fourthItem = await cacheService.getItem(item3)
  let fifthItem = await cacheService.getItem(item4)
  let sixthItem = await cacheService.getItem(item5)
  let trinket = await cacheService.getItem(item6)
  return {
    win,
    champion: {
      name: champ.name,
      image: champ.image.full
    },
    summonerSpells: [
      {
        name: spell1.name,
        image: spell1.image.full
      },
      {
        name: spell2.name,
        image: spell2.image.full
      }
    ],
    kills,
    deaths,
    assists,
    items: [
      {
        name: firstItem.name,
        image: firstItem.image.full
      },
      {
        name: secondItem.name,
        image: secondItem.image.full
      },
      {
        name: thirdItem.name,
        image: thirdItem.image.full
      },
      {
        name: fourthItem.name,
        image: fourthItem.image.full
      },
      {
        name: fifthItem.name,
        image: fifthItem.image.full
      },
      {
        name: sixthItem.name,
        image: sixthItem.image.full
      }
    ],
    trinket: {
      name: trinket.name,
      image: trinket.image.full
    },
    cs: totalMinionsKilled,
    gold: goldEarned,
    gameDuration: match.gameDuration,
    level: champLevel
  }
}

async function getSummoner (summonerName, region) {
  try {
    const accountId = await getAccountId(summonerName)
    if (!accountId) {
      return {
        status: 400,
        error: 'Summoner not found'
      }
    }

    const matchList = await getRecentMatches(accountId, region)
    const matches = []
    await Promise.all(matchList.matches.map(async (m) => {
      const match = await getMatchDetails(m.gameId, region)
      const filteredMatchDetails = await filterMatchDetails(accountId, match)
      matches.push(filteredMatchDetails)
    }))

    return {
      status: 200,
      data: matches
    }
  } catch (err) {
    return {
      status: 400,
      error: err
    }
  }
}

module.exports = getSummoner
