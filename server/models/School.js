const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const SchoolSchema = new Schema({

  name: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  facebook:{
    type: String
  },
  video:{
    type: String
  },
  address: {
    type: String
  },
  shortIntro:{
    type: String
  },
  intro:{
    type: String
  },
  mapPosition: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    }
},

});

module.exports = School = mongoose.model('school', SchoolSchema)