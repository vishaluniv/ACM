const mongoose = require('mongoose');

module.exports = mongoose.model('BaseDrinks', new mongoose.Schema({
  index: Number,
  cost: Number,
  name: String,
  alcohol: Number,
  mixers: Array 
}, { collection : 'basedrink' }));
