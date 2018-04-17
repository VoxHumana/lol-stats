const mongoose = require('mongoose')

const Schema = mongoose.Schema
const itemSchema = new Schema({
  plaintext: String,
  description: String,
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
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '14d'
  }
})

itemSchema.pre('update', function () {
  this.update({}, {
    $set: {
      createdAt: Date.now()
    }
  })
})

module.exports = mongoose.model('StaticItem', itemSchema)
