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
      address: String,
      lat: Number,
      lng: Number
    },
    weather: String,
    attendance: {
      type: Number,
      min: 1
    }
  }]
});

schema.statics = {
  addStop(id, stop) {
    return this.updateById(
      id,
      {
        $push: {
          stops: stop
        }
      }
    )
      .then(tour => tour.stops);
  },

  removeStop(id, stopId) {
    return this.updateById(id, {
      $pull: {
        stops: { _id: stopId }
      }
    })
      .then(tour => tour.stops);
  },

  updateAttendance(id, stopId, attendance) {
    return this.updateOne({
      _id: id,
      'stops._id': stopId
    },
    {
      $set: {
        'stop.$.attendance': attendance
      }
    }
    )
      .then(tour => tour.stops);
  }
};



module.exports = mongoose.model('Tour', schema);