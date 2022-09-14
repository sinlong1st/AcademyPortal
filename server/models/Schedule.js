const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const ScheduleSchema = new Schema({
  courseId:{
    type: Schema.Types.ObjectId,
    ref: "courses"
  },
  events: [
    {
      lessonId: {
        type: Schema.Types.ObjectId,
        ref: "lesson"
      },
      start: {
        type: String
      },
      end: {
        type: String
      },
      date: {
        type: String
      },
      time: [{ type: String }]
    }
  ]
});

module.exports = Schedule = mongoose.model('schedule', ScheduleSchema)