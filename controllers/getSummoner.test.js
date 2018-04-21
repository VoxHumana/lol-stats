const getSummoner = require('./getSummoner')

let options = {
  accountIdService: {},
  matchDetailsService: {},
  recentMatchesService: {},
  cacheService: {},
  memCacheService: {}
}

describe('summoner is in memory cache', () => {
  const MEM_CACHE_RES = 'Mock memcache hit'
  beforeEach(() => {
    options.memCacheService = {
      getByName: async (name) => {
        return MEM_CACHE_RES
      }
    }
  })
  test('return status 200 with cached response', async () => {
    const res = await getSummoner('some_summoner_name', 'na1', options)
    expect(res.status).toBe(200)
    expect(res.error).toBeUndefined()
    expect(res.data).toBe(MEM_CACHE_RES)
  })
})

describe('summoner is not in memory cache', () => {
  const ACCOUNT_ID = 1234
  const PARTICIPANT_ID = 1
  describe('getting account ID fails', () => {
    beforeEach(() => {
      options.memCacheService = {
        getByName: async (name) => {
          return null
        }
      }

      options.accountIdService = {
        getByName: async (name, region) => {
          return null
        }
      }
    })
    test('return 400 status with error message', async () => {
      const res = await getSummoner('some_summoner_name', 'na1', options)
      expect(res.status).toBe(400)
      expect(res.error).toBeDefined()
      expect(res.data).toBeUndefined()
    })
  })
  describe('getting account ID succeeds', () => {
    beforeEach(() => {
      options = {
        memCacheService: {
          getByName: async (name) => {
            return null
          },
          insertByName: async () => {
            return true
          }
        },
        accountIdService: {
          getByName: async (name) => {
            return ACCOUNT_ID
          }
        },
        recentMatchesService: {
          getByAccId: async (id) => {
            return {
              matches: [
                {
                  gameId: 0
                },
                {
                  gameId: 1
                },
                {
                  gameId: 2
                }
              ]
            }
          }
        },
        matchDetailsService: {
          getMatchById: async (id, region) => {
            return {
              'gameId': id,
              'participantIdentities': [
                {
                  'player': {
                    'currentAccountId': ACCOUNT_ID,
                    'accountId': ACCOUNT_ID
                  },
                  'participantId': PARTICIPANT_ID
                }
              ],
              'participants': [
                {
                  'stats': {
                    'kills': 8,
                    'item2': 3158,
                    'item3': 1053,
                    'item0': 3142,
                    'item1': 3071,
                    'item6': 2052,
                    'item4': 3077,
                    'item5': 0,
                    'assists': 7,
                    'participantId': PARTICIPANT_ID,
                    'win': false,
                    'deaths': 5,
                    'goldEarned': 9457,
                    'champLevel': 14
                  },
                  'spell1Id': 32,
                  'participantId': PARTICIPANT_ID,
                  'spell2Id': 4,
                  'championId': 121
                }
              ],
              'gameDuration': 890
            }
          }
        },
        cacheService: {
          getChampion: async () => {
            return {
              name: 'Name',
              image: {
                full: 'Image'
              }
            }
          },
          getItem: async () => {
            return {
              name: 'Name',
              image: {
                full: 'Image'
              }
            }
          },
          getSpell: async () => {
            return {
              name: 'Name',
              image: {
                full: 'Image'
              }
            }
          }
        }
      }
    })
    test('return 200 with response', async () => {
      const res = await getSummoner('some_summoner_name', 'na1', options)
      expect(res.status).toBe(200)
      expect(res.error).toBeUndefined()
      expect(res.data).toBeDefined()
      expect(res.data.length).toBe(3)
    })
  })
  describe('error calling Riot API', () => {
    beforeEach(() => {
      options.memCacheService = {
        getByName: async (name) => {
          return null
        }
      }

      options.accountIdService = {
        getByName: async (name, region) => {
          return ACCOUNT_ID
        }
      }

      options.recentMatchesService = {
        getByAccId: async () => {
          return {}
        }
      }
    })
    test('return 400 status with error message', async () => {
      const res = await getSummoner('some_summoner_name', 'na1', options)
      expect(res.status).toBe(400)
      expect(res.error).toBeDefined()
      expect(res.data).toBeUndefined()
    })
  })
})
