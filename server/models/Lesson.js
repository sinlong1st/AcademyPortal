const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
  courseId: {
    type: String
  },
  rootId: {
    type: String
  },
  text: {
    type: String
  },
  content: {
    type: String
  },
  files: [
    {
      id:{
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
  exercises: [
    {
      type: Schema.Types.ObjectId,
      ref: "exercises",
    }
  ],
  quizzes: [
    {
      quizId:{
        type: Schema.Types.ObjectId,
        ref: "quizzes"
      },
      deadline: {
        type: Date
      },
      startTime: {
        type: Date
      },
      password: {
        type: String,
        default: ''
      }
    }
  ]
})

module.exports = Lesson = mongoose.model('lesson', LessonSchema)

