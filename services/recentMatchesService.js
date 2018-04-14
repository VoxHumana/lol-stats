const request = require('request-promise')

module.exports = async function (accountId, region, count = 10) {
  const options = {
    uri: `https://${region}.api.riotgames.com/lol/match/v3/matchlists/by-account/${accountId}`,
    headers: {
      'X-Riot-Token': process.env.riot_api_key
    },
    qs: {
      beginIndex: 0,
      endIndex: count
    },
    json: true
  }

  return request(options)
}
