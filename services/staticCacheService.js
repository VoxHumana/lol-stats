const request = require('request-promise')
const Champion = require('../models/static/champion')
const Item = require('../models/static/item')
const Spell = require('../models/static/spell')
const CHAMPION_STATIC_V3_URL = 'https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&champListData=image&dataById=false'
const ITEM_STATIC_V3_URL = 'https://na1.api.riotgames.com/lol/static-data/v3/items?locale=en_US&itemListData=image'
const SPELL_STATIC_V3_URL = 'https://na1.api.riotgames.com/lol/static-data/v3/summoner-spells?locale=en_US&spellListData=image&dataById=false'

async function getLatestStaticV3 (url) {
  const options = {
    uri: url,
    headers: {
      'X-Riot-Token': process.env.riot_api_key
    },
    json: true
  }
  return request(options)
}

async function replaceExpiredCache (url, model) {
  let res = await getLatestStaticV3(url)
  for (let item in res.data) {
    model.update({ id: res.data[item].id }, res.data[item],
      { upsert: true })
      .exec()
  }
}

async function findOrUpdateCache (id, model, url) {
  try {
    let item = await model.findOne({ id: id })

    if (item) {
      return item
    } else {
      await replaceExpiredCache(url, model)
      return await model.findOne({ id: id })
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  initStaticCache: async () => {
    try {
      let item = await Item.findOne()
      let spell = await Spell.findOne()
      let champ = await Champion.findOne()

      if (!item || !spell || !champ) {
        await replaceExpiredCache(ITEM_STATIC_V3_URL, Item)
        await replaceExpiredCache(SPELL_STATIC_V3_URL, Spell)
        await replaceExpiredCache(CHAMPION_STATIC_V3_URL, Champion)
        await insertEmptyItem()
      }
    } catch (err) {
      console.error(err)
    }
  },
  getChampion: async (id) => {
    return findOrUpdateCache(id, Champion, CHAMPION_STATIC_V3_URL)
  },
  getItem: async (id) => {
    if (id === 0) {
      return {
        name: "empty",
        image: {
          full : "empty"
        }
      }
    } else {
      return findOrUpdateCache(id, Item, ITEM_STATIC_V3_URL)
    }
  },
  getSpell: async (id) => {
    return findOrUpdateCache(id, Spell, SPELL_STATIC_V3_URL)
  }
}
