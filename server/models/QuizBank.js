const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizBankSchema = new Schema({
  category: {
    type: String
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
        type: String
      }],
      correctAnswer: [{
        type: String
      }],
      explanation: {
        type: String
      },
      creator: {
        type: mongoose.Schema.ObjectId, 
        ref: 'users'
      }
    }
  ],
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = QuizBank = mongoose.model('quizbank', QuizBankSchema)

