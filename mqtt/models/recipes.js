const mongoose = require('mongoose');

module.exports = mongoose.model('Drinks', new mongoose.Schema({
  index: Number,
  name: String,
  cost: Number,
  alcohol: Number,
  des: String,
  ingredients: Array 
}, { collection : 'drinks' }));
