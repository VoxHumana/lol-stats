module.exports = function (memCache) {
  return {
    getByName: async (name) => {
      try {
        console.log(`Getting ${name} from Redis`)
        const res = await memCache.get(name)
        if (!res) {
          console.log(`Could not find ${name} in Redis`)
          return null
        } else {
          console.log(`Found ${name} in Redis`)
          return JSON.parse(res)
        }
      } catch (err) {
        console.error(err)
        return null
      }
    },
    insertByName: async (name, ex, data) => {
      try {
        console.log(`Inserting ${name} into Redis`)
        await memCache.setex(name, ex, data)
      } catch (err) {
        console.error(err)
      }
    }
  }
}
