const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Shema
const LogSchema = new Schema({
  exercise:{
    type: Schema.Types.ObjectId,
    ref:'Exercise',
    required: true
  },
  notes:{
    type: String,
    required: true
  },
  duration: {
    type: Date,
    default: new Date(0)
  },
  status: {
    type: String,
    default:'public'
  },
  rating: [{
    rating:{
      type: Number,
      default: 0
    }
  }],
  futureNotes: {
    type: String
  },
  user:{
    type: Schema.Types.ObjectId,
    ref:'User'
  },
  date:{
    type: Date,
    default: Date.now
  }
});

const Log = mongoose.model('Log', LogSchema);

module.exports = {Log};