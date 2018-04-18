module.exports = function (memCache) {
  return {
    getByName: async (name) => {
      try {
        const res = await memCache.get(name)
        if (!res) {
          return null
        } else {
          return JSON.parse(res)
        }
      } catch (err) {
        console.error(err)
        return null
      }
    },
    insertByName: async (name, ex, data) => {
      try {
        await memCache.setex(name, ex, data)
      } catch (err) {
        console.error(err)
      }
    }
  }
}
