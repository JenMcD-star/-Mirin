const mongoose = require('mongoose')


const ActivitySchema = new mongoose.Schema({
  activityName: {
    type: String,
    maxlength: 150,
    default: 'Session',
    required: [true, 'Please provide activity name']
  },
  date: {
    type: Date,
    default: Date.now
  },
  liftType: {
    type: String,
    required: [true, 'Please enter lift type'],
    enum: {
      values: ['Ancillary', 'Supplemental', 'Core'],
    },
  },
  weight: {
    type: Number
  },
  reps: {
    type: Number
  },
  description: {
    type: String,
    maxlength: 350
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
}, { timestamps: true })


module.exports = mongoose.model('Activity', ActivitySchema);