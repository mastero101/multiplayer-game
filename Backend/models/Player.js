const mongoose = require('mongoose');

const AbilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 1
  }
});

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  str: {
    type: Number,
    default: 0
  },
  dex: {
    type: Number,
    default: 0
  },
  vit: {
    type: Number,
    default: 0
  },
  int: {
    type: Number,
    default: 0
  },
  luk: {
    type: Number,
    default: 0
  },
  experience: {
    type: Number,
    default: 0
  },
  abilities: [AbilitySchema],
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  }
});

module.exports = mongoose.model('Player', PlayerSchema);
