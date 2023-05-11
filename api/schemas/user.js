const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
  uname: String,
  passw: String,
  prevdrinks: Array, 
  orders: Array 
}, { collection : 'user' }));