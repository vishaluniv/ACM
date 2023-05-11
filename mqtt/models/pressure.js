const mongoose = require('mongoose');

module.exports = mongoose.model('Pressure', new mongoose.Schema({
  sensorID: Number, 
  dateTime: Date,
  pressure: Number
}, { collection : 'pressure' }));

