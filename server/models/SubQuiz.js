const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

//Create schema
const SubQuizSchema = new Schema({
  quizId: {type: mongoose.Schema.ObjectId, ref: 'quizzes'},
  courseId: {type: mongoose.Schema.ObjectId, ref: 'courses'},
  studentSubmission: [
    {
      userId:{type: mongoose.Schema.ObjectId, ref: 'users'},
      point:{
        type: Number,
      },
      answer: []
    }
  ]
})

module.exports = SubQuiz = mongoose.model('subquiz', SubQuizSchema)