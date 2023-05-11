const mongoose = require('mongoose');

module.exports = mongoose.model('BaseDrinks', new mongoose.Schema({
  index: Number,
  cost: Number,
  name: String,
  mixers: Array //either names or integer numbers
}, { collection : 'basedrink' }));
