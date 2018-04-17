const mongoose = require('mongoose')

const Schema = mongoose.Schema
const champSchema = new Schema({
  image: {
    full: String,
    group: String,
    sprite: String,
    h: Number,
    w: Number,
    y: Number,
    x: Number
  },
  title: String,
  id: {
    type: Number,
    index: true,
    unique: true
  },
  key: String,
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '14d'
  }
})

champSchema.pre('update', function () {
  this.update({}, {
    $set: {
      createdAt: Date.now()
    }
  })
})

module.exports = mongoose.model('StaticChampion', champSchema)
