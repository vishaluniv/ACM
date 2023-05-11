const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
  uname: String,
  passw: String,
  prevdrinks: Array, //max 5 drinks, update the database each time to contain just the latest 5 drinks
  orders: Array //{transaction numbers, cost, drink}
}, { collection : 'user' }));