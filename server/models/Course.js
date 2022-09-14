const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

const CourseSchema = new Schema({
  code:{
    type: String
  },
  coursedetail: {
    type: mongoose.Schema.ObjectId, ref: 'coursedetail'
  },
  title: {
    type: String,
    required: true
  },
  enrollDeadline:{
    type: Date
  },
  intro: {
    type: String
  },
  coursePhoto: {
    type: String,
    default: process.env.COURSE_PHOTO_DEFAULT
  },
  maxStudent: {
    type: Number
  },
  days: [
    {
      dayName: {
        type: String
      },
      time: [
        { type: String }
      ]
    }
  ],
  pointColumns: [{
    pointName: {
      type: String
    },
    pointRate: {
      type: Number
    },
    test:{
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'pointColumns.testModel'
    },
    testModel: {
      type: String,
      enum: ['exercises', 'quizzes']
    },
    submit:{
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'pointColumns.submitModel'
    },
    submitModel: {
      type: String,
      enum: ['subexcercise', 'subquiz']
    }
  }],
  infrastructure: {
    type: mongoose.Schema.ObjectId, ref: 'infrastructures',
  },
  teachers: [{type: mongoose.Schema.ObjectId, ref: 'users'}],
  students: [{type: mongoose.Schema.ObjectId, ref: 'users'}],
  exercises: [{type: mongoose.Schema.ObjectId, ref: 'exercises'}],
  quizzes: [{type: mongoose.Schema.ObjectId, ref: 'quizzes'}],
  created: {
    type: Date,
    default: Date.now
  },
  certification: {
    type: mongoose.Schema.ObjectId,
    ref: 'certification'
  },
  minScore: {
    type: Number
  },
  minAbsent: {
    type: Number
  }
})

module.exports = Course = mongoose.model('courses', CourseSchema)

