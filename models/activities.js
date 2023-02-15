const mongoose = require('mongoose')
 

const ActivitySchema = new mongoose.Schema({  name: {
    type: String,
    maxlength: 150,
    minlength: 3,
    default: 'Session'
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: Object,
    enums: ["core", "supplemental", "ancillary"],
    description: "Must be core, supplemental or ancillary"

 
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
})


module.exports = mongoose.model('Activity', ActivitySchema);