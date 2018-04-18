const assert = require('assert')
const MEMCACHE_EXPIRATION_SECS = 300

function getSummonerParticipantId (id, participants) {
  return (participants.find(p => p.player.currentAccountId === id)).participantId
}

async function getStaticData (IdList, cache) {
  return {
    champ: await cache.getChampion(IdList.championId),
    spell1: await cache.getSpell(IdList.spell1Id),
    spell2: await cache.getSpell(IdList.spell2Id),
    item0: await cache.getItem(IdList.item0),
    item1: await cache.getItem(IdList.item1),
    item2: await cache.getItem(IdList.item2),
    item3: await cache.getItem(IdList.item3),
    item4: await cache.getItem(IdList.item4),
    item5: await cache.getItem(IdList.item5),
    trinket: await cache.getItem(IdList.item6)
  }
}

function createMatchObject (stats) {
  return {
    win: stats.win,
    champion: {
      name: stats.champ.name,
      image: stats.champ.image.full
    },
    summonerSpells: [
      {
        name: stats.spell1.name,
        image: stats.spell1.image.full
      },
      {
        name: stats.spell2.name,
        image: stats.spell2.image.full
      }
    ],
    kills: stats.kills,
    deaths: stats.deaths,
    assists: stats.assists,
    items: [
      {
        name: stats.item0.name,
        image: stats.item0.image.full
      },
      {
        name: stats.item1.name,
        image: stats.item1.image.full
      },
      {
        name: stats.item2.name,
        image: stats.item2.image.full
      },
      {
        name: stats.item3.name,
        image: stats.item3.image.full
      },
      {
        name: stats.item4.name,
        image: stats.item4.image.full
      },
      {
        name: stats.item5.name,
        image: stats.item5.image.full
      }
    ],
    trinket: {
      name: stats.trinket.name,
      image: stats.trinket.image.full
    },
    cs: stats.totalMinionsKilled,
    gold: stats.goldEarned,
    gameDuration: stats.gameDuration,
    level: stats.champLevel
  }
}

async function filterMatchDetails (accountId, match, cacheService) {
  const targetId = getSummonerParticipantId(accountId, match.participantIdentities)
  if (targetId == null || targetId === undefined) {
    throw new Error(`Cannot find summoner in ${match.gameId}`)
  }
  const targetPlayer = match.participants.find(p => p.participantId === targetId)

  const idList = {
    championId: targetPlayer.championId,
    spell1Id: targetPlayer.spell1Id,
    spell2Id: targetPlayer.spell2Id,
    item0: targetPlayer.stats.item0,
    item1: targetPlayer.stats.item1,
    item2: targetPlayer.stats.item2,
    item3: targetPlayer.stats.item3,
    item4: targetPlayer.stats.item4,
    item5: targetPlayer.stats.item5,
    item6: targetPlayer.stats.item6
  }

  const playerStats = {
    win: targetPlayer.stats.win,
    kills: targetPlayer.stats.kills,
    deaths: targetPlayer.stats.deaths,
    assists: targetPlayer.stats.assists,
    totalMinionsKilled: targetPlayer.stats.totalMinionsKilled,
    goldEarned: targetPlayer.stats.goldEarned,
    champLevel: targetPlayer.stats.champLevel,
    gameDuration: match.gameDuration
  }

  const staticData = await getStaticData(idList, cacheService)
  const stats = Object.assign(staticData, playerStats)

  return createMatchObject(stats)
}

module.exports = async function (summonerName, region, options) {
  const {
    accountIdService,
    recentMatchesService,
    matchDetailsService,
    cacheService,
    memCacheService
  } = options

  assert(accountIdService, 'options.accountIdService is required')
  assert(recentMatchesService, 'options.recentMatchesService is required')
  assert(matchDetailsService, 'options.matchDetailsService is required')
  assert(cacheService, 'options.cacheService is required')
  assert(memCacheService, 'options.memCacheService is required')

  try {
    let hit = await memCacheService.getByName(summonerName)
    if (hit) {
      return {
        status: 200,
        data: hit
      }
    } else {
      const accountId = await accountIdService.getByName(summonerName, region)
      if (!accountId) {
        return {
          status: 400,
          error: 'Summoner not found'
        }
      }
  
      const matchList = await recentMatchesService.getByAccId(accountId, region)
      const matches = await Promise.all(matchList.matches.map(async (m) => {
        const match = await matchDetailsService.getMatchById(m.gameId, region)
        return filterMatchDetails(accountId, match, cacheService)
      }))
      
      memCacheService.insertByName(summonerName, MEMCACHE_EXPIRATION_SECS, JSON.stringify(matches))
      
      return {
        status: 200,
        data: matches
      }
    }
  
  } catch (err) {
    return {
      status: 400,
      error: err
    }
  }
}
