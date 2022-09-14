const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  listQuiz: [
    {      
      question: {
        type: String
      },
      questionType: {
        type: String
      },
      answers: [{
        required: true,
        type: String
      }],
      correctAnswer: [{
        required: true,
        type: String
      }],
      explanation: {
        type: String
      }
    }
  ],
  time: {
    type: Number,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = Quiz = mongoose.model('quizzes', QuizSchema)

