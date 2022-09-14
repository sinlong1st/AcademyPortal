const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');

// Course Model
const Schedule = require('../../models/Schedule');
const Course = require('../../models/Course');
const SubQuiz = require('../../models/SubQuiz');


router.use(cors());


// @route   POST api/schedule/add-schedule
// @desc    add schedule
// @access  Private
router.post(
  '/add-schedule',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    req.body.events.map(e=> {delete e.id; delete e.text})
    Schedule.findOneAndUpdate(
      { courseId: req.body.courseId },
      { events: req.body.events }
    )
    .then(res.json({mes:'Lưu thành công'}))
    .catch(err => console.log(err));
  }
);

// @route   GET api/schedule/get-schedule/:courseId
// @desc    get schedule by courseId
// @access  Private
router.get(
  '/get-schedule/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        const schedule = await 
        Schedule.findOne(
          { courseId: req.params.courseId }
        )
        .populate('events.lessonId','text')
        .lean()

        schedule.events.map(e=>{
          e.text = e.lessonId.text
          e.lessonId = e.lessonId._id
        })

        res.json(schedule)
      } catch (err) {
        console.log(err)
      }
    }

    run();

  }
);

// @route   GET api/schedule/get-event-schedule/:courseId/:eventId
// @desc    get event schedule by courseId eventId
// @access  Private
router.get(
  '/get-event-schedule/:courseId/:eventId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    async function run() {
      try {
        const schedule = await 
        Schedule.findOne(
          { 
            courseId: req.params.courseId
          },
          {
            events: { $elemMatch: { _id: req.params.eventId }}
          }
        )
        .populate({
          path: 'events.exercises'
        })
        .populate({
          path: 'events.quizzes.quizId'
        })
        res.json(schedule.events[0])
      } catch (err) {
        console.log(err)
      }
    }

    run();

  }
);

// @route   POST api/schedule/edit-event
// @desc    edit event
// @access  Private
router.post(
  '/edit-event/:courseId/:eventId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Schedule.updateOne(
      { courseId: req.params.courseId, "events._id": req.params.eventId },
      { 
        $set: 
        { 
          "events.$.text" : req.body.text ,
          "events.$.files" : req.body.files ,
          "events.$.content" : req.body.content
        }
      }
    )
    .then(res.json({mes: 'Thay đổi nội dung bài học thành công'}))
    .catch(err => console.log(err));
  }
);

// @route   POST api/schedule/add-quiz-event/:courseId/:eventId/:quizId
// @desc    add quiz event
// @access  Private
router.post(
  '/add-quiz-event/:courseId/:eventId/:quizId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    const quiz = {
      quizId: req.params.quizId,
      deadline: req.body.deadline 
    }

    const newSubQuiz = new SubQuiz({
      quizId: req.params.quizId,
      courseId: req.params.courseId,
      studentSubmission: []
    });

    async function run() {
      try {

        const course = await Course.findById(req.params.courseId);
        const find = course.quizzes.find(quiz => quiz.toString() === req.params.quizId.toString());
        if(find === undefined)
        {
          course.quizzes.unshift(req.params.quizId);
          await course.save();
        }

        //create subQuiz
        await newSubQuiz.save();

        await  
        Schedule.updateOne(
          { courseId: req.params.courseId, "events._id": req.params.eventId },
          { 
            $push: 
            { 
              "events.$.quizzes" : quiz
            }
          }
        )

        res.json({mes: 'Chọn bài trắc nghiệm cho bài học thành công'});
      } catch (err) {
        console.log(err)
      }
    }
    run();
  }
);

module.exports = router;