const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
require('dotenv').config()

// Model
const QuizBank = require('../../models/QuizBank');
const validateAddMoreQuizInput = require('../../validation/addMoreQuiz');
const validateEditQuizInput = require('../../validation/editQuiz');

router.use(cors());

// @route   POST api/quizbank/add-category
// @desc    add quizbank
// @access  Private
router.post(
  '/add-category',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    if (req.body.category === '') {
      let errors = {};
      errors.category = 'Hãy nhập tên danh mục'
      return res.status(400).json(errors);
    }

    async function run() {
      try {

        const newQuizBank = new QuizBank({
          category: req.body.category
        });

        await newQuizBank.save()

        res.json({mes: 'Thêm danh mục thành công'})

      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/quizbank/edit-category-name/:catId
// @desc    edit category name
// @access  Private
router.post(
  '/edit-category-name/:catId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    if (req.body.category === '') {
      let errors = {};
      errors.category = 'Hãy nhập tên danh mục'
      return res.status(400).json(errors);
    }

    async function run() {
      try {

        await
        QuizBank.findByIdAndUpdate( 
          req.params.catId,
          { category: req.body.category }
        )

      .then(res.json({mes: 'Thay đổi tên danh mục thành công'}))
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/test/add-more-quiz/:catId
// @desc    teachcer add quiz
// @access  Private
router.post('/add-more-quiz/:catId', passport.authenticate('jwt', {session: false}),(req, res) => {
  const { errors, isValid } = validateAddMoreQuizInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  req.body.listQuiz.map(quiz=>
    {
      return quiz.creator = req.user.id
    }
  )

  QuizBank.updateOne(
    { _id: req.params.catId },
    {
      $push: {
        listQuiz: {
           $each: req.body.listQuiz
        }
      }
    }
  )    
  .then(res.json({ mes: 'Thêm câu hỏi vào danh mục thành công' }))
  .catch(err => console.log(err));

});

// @route   POST api/quizbank/add-more-quiz-csv/:catId
// @desc    teachcer create test quiz
// @access  Private
router.post('/add-more-quiz-csv/:catId', passport.authenticate('jwt', {session: false}),(req, res) => {

  req.body.listQuiz.map(quiz=>
    {
      return quiz.creator = req.user.id
    }
  )

  QuizBank.updateOne(
    { _id: req.params.catId },
    {
      $push: {
        listQuiz: {
           $each: req.body.listQuiz
        }
      }
    }
  )    
  .then(res.json({ mes: 'Thêm câu hỏi thành công' }))
  .catch(err => console.log(err));

});

// @route   POST api/quizbank/edit-quiz/:catId
// @desc    teachcer create test quiz
// @access  Private
router.post('/edit-quiz/:catId', passport.authenticate('jwt', {session: false}),(req, res) => {

  const { errors, isValid } = validateEditQuizInput(req.body.quiz);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  QuizBank.updateOne(
    { _id: req.params.catId, "listQuiz._id": req.body.quiz._id },
    {
      $set: 
      { 
        "listQuiz.$.question" :  req.body.quiz.question,
        "listQuiz.$.answers" :  req.body.quiz.answers,    
        "listQuiz.$.correctAnswer" :  req.body.quiz.correctAnswer,      
        "listQuiz.$.explanation" :  req.body.quiz.explanation     
      } 
    }
  )    
  .then(res.json({ mes: 'Thay đổi câu hỏi thành công' }))
  .catch(err => console.log(err));

});

// @route   POST api/quizbank/delete-quiz/:catId/:listquizId
// @desc    delete quiz
// @access  Private
router.post('/delete-quiz/:catId/:listquizId', passport.authenticate('jwt', {session: false}),(req, res) => {

  QuizBank.updateOne(
    { _id: req.params.catId },
    { 
      $pull: {
        listQuiz: {
          _id: req.params.listquizId
        }
      }
    }
  )    
  .then(res.json({ mes: 'Xóa câu hỏi thành công' }))
  .catch(err => console.log(err));

});
module.exports = router;