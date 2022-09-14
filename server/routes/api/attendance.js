const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
const moment = require('moment');

// Course Model
const Attendance = require('../../models/Attendance');
const Schedule = require('../../models/Schedule');

router.use(cors());


// @route   POST api/attendance/add-attendance
// @desc    add attendance
// @access  Private
router.post(
  '/add-attendance',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const newAttendance = new Attendance({
      courseId: req.body.courseId,
      students: req.body.students,
      date: req.body.date,
    });

    newAttendance
    .save()
    .then(attendance => {
      res.json(attendance)
    })
  }
);

// @route   GET api/attendance/get-attendance/:courseId
// @desc    get attendance by courseId
// @access  Private
router.get(
  '/get-attendance/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    Attendance.find(
      { 
        'courseId' : req.params.courseId
      }
    )
    .populate('students.userId', '_id name email photo code')
    .then(attendance => res.json(attendance))
    .catch(err => console.log(err));
  }
);

// @route   GET api/attendance/get-today-attendance/:courseId
// @desc    get today attendance by courseId
// @access  Private
router.post(
  '/get-today-attendance/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    Attendance.findOne(
      { 
        'courseId' : req.params.courseId,
        'date' : req.body.selectDate
      }
    )
    .populate('students.userId', '_id name email photo code')
    .then(attendance => res.json(attendance))
    .catch(err => console.log(err));
  }
);

// @route   POST api/attendance/edit-attendance
// @desc    edit attendance
// @access  Private
router.post(
  '/edit-attendance',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Attendance.updateOne(
      { "_id" : req.body._id},
      { $set: { "students" :  req.body.students} }
    )    
    .then(attendance => {
      res.json(attendance)
    })
  }
);

// @route   GET api/attendance/get-student-absent/:courseId/:studentId
// @desc    get a student absent list in a course by courseId and that studentId
// @access  Private
router.get(
  '/get-student-absent/:courseId/:studentId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    Attendance.find({
      'courseId': req.params.courseId,
      students: { $elemMatch: { 'userId': req.params.studentId, isPresent: false } } 
    },{date: 1}, function(err, absentlist){
      Attendance.countDocuments({ 
        'courseId': req.params.courseId, 
        'students.userId': req.params.studentId
      },function(err, count) {
        const data = {};
        data.attendanceNumber = count
        data.absentlist = []
        data.courseId = req.params.courseId

        return Promise.all(absentlist.map(element=>{
        return Schedule.find(
          {
            'courseId': req.params.courseId, 
            "events.date": element.date
          },
          { 
            _id: 0,
            events: { 
              $elemMatch: {
                'date': element.date
              }
            }
          })
          .populate('events.lessonId','text')
          .then(schedule => {
            var temp = {};
            if(schedule[0] != null )
              if(schedule[0].events.length !== 0)
                temp.event = schedule[0].events[0]

            temp._id = element._id
            temp.date = element.date
            data.absentlist.push(temp)
          })
        }))
        .then(()=>res.json(data))
      })
    });

  }
);
module.exports = router;