const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');

// Model
const LessonList = require('../../models/LessonList');
const Lesson = require('../../models/Lesson');
const Certification = require('../../models/Certification');

const validateAddLessonListInput = require('../../validation/addlessonlist');

router.use(cors());


// @route   POST api/lesson/add-lesson-list
// @desc    add lesson list
// @access  Private
router.post(
  '/add-lesson-list',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    const { errors, isValid } = validateAddLessonListInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    async function run() {
      try {
        var lesson = [];
        for( var i=0; i < req.body.noLesson; i++ )
        {
          var temp = {}
          temp.text = 'Buổi học ' +  Number(i + 1);
          lesson.push(temp)
        }

        const newCertification = new Certification({
          name: req.body.certification
        });

        var certification = await newCertification.save();

        const newLessonList = new LessonList({
          title: req.body.title,
          certification: certification._id,
          lesson
        });

        await newLessonList.save()

        res.json({mes: 'Thêm danh sách bài học'})

      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/lesson/edit-lesson-list-name/:listId
// @desc    edit lesson list name
// @access  Private
router.post(
  '/edit-lesson-list-name/:listId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    if (req.body.title === '') {
      let errors = {};
      errors.title = 'Hãy điền tên danh sách bài học'
      return res.status(400).json(errors);
    }

    async function run() {
      try {

        await
        LessonList.findByIdAndUpdate( 
          req.params.listId,
          { title: req.body.title }
        )

      .then(res.json({mes: 'Thay đổi tên danh sách thành công'}))
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/lesson/edit-lesson-list-certification/:listId
// @desc    edit lesson list certification
// @access  Private
router.post(
  '/edit-lesson-list-certification/:listId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    if (req.body.certification === '') {
      let errors = {};
      errors.certification = 'Hãy điền tên chứng chỉ'
      return res.status(400).json(errors);
    }

    async function run() {
      try {
        if(req.body.certificationId)
        {
          await
          Certification.findByIdAndUpdate(
            req.body.certificationId,
            { name: req.body.certification }
          )
        }else{

          const newCertification = new Certification({
            name: req.body.certification
          });

          var certification = await newCertification.save();

          await
          LessonList.findByIdAndUpdate( 
            req.params.listId,
            { certification: certification._id }
          )
        }

      res.json({mes: 'Thay đổi tên chứng chỉ thành công'})
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/lesson/get-lesson-list
// @desc    get lesson list
// @access  Private
router.get(
  '/get-lesson-list',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    LessonList.find({},'title lesson._id lesson.text').sort({created: -1}).then(list=>res.json(list)).catch(err => console.log(err));
  }
);

// @route   POST api/lesson/get-lesson-in-list
// @desc    get a lesson in list
// @access  Private
router.get(
  '/get-lesson-in-list/:listId/:lessonId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    LessonList.findOne({ _id: req.params.listId },{ lesson:{ $elemMatch:{ _id: req.params.lessonId } } })
    .then(lesson=>res.json(lesson))
    .catch(err => console.log(err));
  }
);

// @route   POST api/lesson/edit-lesson/:listId/:lessonId
// @desc    edit lesson 
// @access  Private
router.post(
  '/edit-lesson/:listId/:lessonId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {

        await
        LessonList.updateOne(
          { _id: req.params.listId, "lesson._id": req.params.lessonId },
          { 
            $set: 
            { 
              "lesson.$.text" : req.body.text ,
              "lesson.$.files" : req.body.files ,
              "lesson.$.content" : req.body.content
            }
          }
        )
        
        await
        Lesson.updateMany(
          { "rootId": req.params.lessonId },
          {
            $set: 
            { 
              text : req.body.text ,
              files : req.body.files ,
              content : req.body.content
            }
          }
        )

      .then(res.json({mes: 'Thay đổi nội dung bài học thành công'}))
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/lesson/get-list-nolesson/:number
// @desc    lấy danh sách bài học có số buổi học tùy chọn
// @access  Private
router.get(
  '/get-list-lessonTotal/:lessonTotal',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    LessonList.aggregate([
      {
        $project: {
          title: 1,
          lessonTotal: { $size: "$lesson" }
        }
      }
    ])
    .then(list=>{
      var found = list.filter(element => element.lessonTotal == req.params.lessonTotal)
      res.json(found)
    })
    .catch(err => console.log(err));

  }
);

// @route   POST api/lesson/get-lesson-in-course/${courseId}/${lessonId}
// @desc    lấy 1 bài học trong khóa học
// @access  Private
router.get(
  '/get-lesson-in-course/:courseId/:lessonId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Lesson.findOne({_id: req.params.lessonId, courseId: req.params.courseId})
    .populate({
      path: 'exercises'
    })
    .populate({
      path: 'quizzes.quizId'
    })
    .then(lesson=>res.json(lesson))
    .catch(err => console.log(err));
  }
);

// @route   POST api/lesson/add-quiz-event/:courseId/:lessonId/:quizId
// @desc    add quiz inlesson
// @access  Private
router.post(
  '/add-quiz-event/:courseId/:lessonId/:quizId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {

        const find = await Course.findOne({
          '_id': req.params.courseId,
          quizzes: req.params.quizId
        });

        if(find)
        {
          let errors = {};
          errors.addfail = 'Bài trắc nghiệm đã có trong khóa học này'
          return res.status(400).json(errors);
        }else{
          const quiz = {
            quizId: req.params.quizId,
            password: req.body.password,
            deadline: req.body.deadline,
            startTime: req.body.startTime
          }
          const newSubQuiz = new SubQuiz({
            quizId: req.params.quizId,
            courseId: req.params.courseId,
            studentSubmission: []
          });

          console.log(quiz, newSubQuiz)

          const course = await Course.findById(req.params.courseId);
          course.quizzes.push(req.params.quizId);
          await course.save();

          await newSubQuiz.save();

          await  
          Lesson.updateOne(
            { courseId: req.params.courseId, _id: req.params.lessonId },
            { 
              $push: 
              { 
                quizzes : quiz
              }
            }
          )

          res.json({mes: 'Chọn bài trắc nghiệm cho bài học thành công'});
        }
      } catch (err) {
        console.log(err)
      }
    }
    run();
  }
);

module.exports = router;