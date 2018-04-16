const mongoose = require('mongoose')

const Schema = mongoose.Schema
const spellSchema = new Schema({
  image: {
    full: String,
    group: String,
    sprite: String,
    h: Number,
    w: Number,
    y: Number,
    x: Number
  },
  id: {
    type: Number,
    index: true,
    unique: true
  },
  name: String,
  summonerLevel: Number,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '14d'
  }
})

spellSchema.pre('update', function() {
  this.update({}, {
    $set: {
      createdAt: Date.now()
    }
  })
})

module.exports = mongoose.model('StaticSpell', spellSchema)
