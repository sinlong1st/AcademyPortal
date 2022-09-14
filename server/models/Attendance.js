const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
  courseId: {
    type: String
  },
  students: [
    {      
      userId: {
        type: mongoose.Schema.ObjectId, ref: 'users'
      },
      isPresent: {
        type: Boolean
      }
    }
  ],
  date: {
    type: String
  }
})

module.exports = Attendance = mongoose.model('attendance', AttendanceSchema)

