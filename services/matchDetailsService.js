const request = require('request-promise')

module.exports = async function (id, region) {
  const options = {
    uri: `https://${region}.api.riotgames.com/lol/match/v3/matches/${id}`,
    headers: {
      'X-Riot-Token': process.env.riot_api_key
    },
    json: true
  }

  return request(options)
}
