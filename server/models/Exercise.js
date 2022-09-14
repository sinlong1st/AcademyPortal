const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String
  },
  pointColumn: {
      type: mongoose.Schema.ObjectId, ref: 'courses'
  },  
  attachFiles: [
    {      
      id: {
        type: String
      },
      name: {
        type: String
      },
      url: {
        type: String
      },
      thumbnail: {
        type: String
      }
    }
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.ObjectId, ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      created: {
        type: Date,
        default: Date.now
      }
    }
  ],
  deadline:{
    type: Date
  },
  password: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  courseId:{type: mongoose.Schema.ObjectId, ref: 'courses'}
})

module.exports = Exercise = mongoose.model('exercises', ExerciseSchema)

