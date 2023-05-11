const mongoose = require('mongoose');

module.exports = mongoose.model('Orders', new mongoose.Schema({
  trans: String,
  content: Array,
  dateTime: Date,
  Cost: String
}, { collection : 'orders' }));

