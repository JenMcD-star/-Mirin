const mongoose = require('mongoose')


const ActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 150,
    minlength: 3,
    default: 'Session'
  },
  date: {
    type: Date,
    default: Date.now
  },
  liftType: {
    type: String,
    enum: {
      values: ['Ancillary', 'Supplemental', 'Core'],
      message: '{VALUE} is not supported',
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