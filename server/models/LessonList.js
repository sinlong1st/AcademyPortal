const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LessonListSchema = new Schema({
  title: {
    type: String
  },
  certification: {
    type: mongoose.Schema.ObjectId,
    ref: 'certification'
  },
  lesson: [
    {
      text: {
        type: String
      },
      content: {
        type: String
      },
      files: [
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
      ]
    }
  ],
  created:{
    type: Date,
    default : Date.now
  }
})

module.exports = LessonList = mongoose.model('lessonlist', LessonListSchema)

