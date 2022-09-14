const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CertificationSchema = new Schema({
  name:{
    type: String
  }
})

module.exports = Certification = mongoose.model('certification', CertificationSchema)