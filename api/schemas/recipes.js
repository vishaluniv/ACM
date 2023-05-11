const mongoose = require('mongoose');

module.exports = mongoose.model('Drinks', new mongoose.Schema({
  index: Number,
  name: String,
  cost: Number,
  alcohol: Number,
  descrip: String,
  ingredients: Array 
}, { collection : 'drinks' }));
