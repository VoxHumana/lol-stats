const request = require('request-promise')

module.exports = function () {
  return {
    getByName: async (name, region) => {
      const options = {
        uri: `https://${region}.api.riotgames.com/lol/summoner/v3/summoners/by-name/${name}`,
        headers: {
          'X-Riot-Token': process.env.riot_api_key
        },
        json: true
      }

      const res = await request(options)
      return res.accountId
    }
  }
}
