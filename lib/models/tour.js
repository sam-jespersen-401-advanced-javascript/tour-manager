const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RequiredString } = require('./required-types');

const schema = new Schema({
  title: RequiredString,
  activities: [String],
  launchDate: {
    type: Date,
    default: new Date()
  },
  stops: [{
    location: {
      lat: Number,
      lng: Number
    },
    weather: {
      desc: String
    },
    attendance: {
      type: Number,
      min: 1
    }
  }]
});

module.exports = mongoose.model('Tour', schema);