const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema
const SubExerciseSchema = new Schema({
  exerciseId:{type: mongoose.Schema.ObjectId, ref: 'exercises'},
  studentSubmission:[
    {
      userId:{type: mongoose.Schema.ObjectId, ref: 'users'},
      attachFile: {
        name: {
          type: String
        },
        url: {
          type: String
        }
      },
      point:{
        type: Number
      },
      isSubmit:{
        type: Boolean,
        default: false
      },
      submitTime: {
        type: Date
      },
      note:{
        type: String        
      }
    }
  ]
})

module.exports = SubExercise = mongoose.model('subexcercise', SubExerciseSchema)