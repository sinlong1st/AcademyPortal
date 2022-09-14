const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();

//Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  idCard:{
    type: String
  },
  code: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    default: process.env.USER_PHOTO_DEFAULT
  },
  role: { 
    type: String,
    trim: true
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "courses"
    }
  ],
  created:{
    type: Date,
    default : Date.now
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  teacherDegree: {
    type: String
  },
  teacherIntro: {
    type: String
  },
  teacherRating: [
    {
      user: {
        type: mongoose.Schema.ObjectId, ref: 'users'
      },
      course: {
        type: Schema.Types.ObjectId,
        ref: "courses"
      },
      star1: {
        type: Number
      },
      star2: {
        type: Number
      },
      star3: {
        type: Number
      },
      star4: {
        type: Number
      },
      star5: {
        type: Number
      },
      star: {
        type: Number
      },
      text: {
        type: String
      },
      created: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = User = mongoose.model('users',UserSchema)