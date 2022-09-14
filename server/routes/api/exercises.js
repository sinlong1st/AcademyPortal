const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
require('dotenv').config()
const Validator = require('validator');
const rimraf = require("rimraf");

const fileUpload = require('express-fileupload');
const fs = require('fs');


// Load Input Validation
const validateAddExerciseInput = require('../../validation/addexercise');


// Course Model
const Course = require('../../models/Course');
const User = require('../../models/User');
const Exercise = require('../../models/Exercise');
const SubExercise = require('../../models/SubExercise');
const Schedule = require('../../models/Schedule');
const Lesson = require('../../models/Lesson');

router.use(cors());

router.use(fileUpload());

// @route   POST api/exercise/add-exercise
// @desc    add exercise
// @access  Private
router.post(
  '/add-point',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    SubExercise.updateOne(
      {
        exerciseId: req.body.exerciseId,
      },
      {
        $set: { 
          studentSubmission : req.body.studentSubmission
        }
      } 
    ).then(
      res.json({mes:"Nhập điểm thành công"})
    );
  }
);

// @route   post api/exercises/download-submission
// @desc    download student submission
// @access  Private
router.post('/get-file-submission', passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.download(req.body.urlFile);
});

// @route   POST api/exercise/add-exercise
// @desc    add exercise
// @access  Private
router.post(
  '/add-exercise',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddExerciseInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    const newExercise = new Exercise({
      title: req.body.title,
      text: req.body.text,
      attachFiles: req.body.attachFiles,
      deadline: req.body.deadline,
      password: req.body.password,
      courseId: req.body.courseId
    });

    async function run() {
      try {
        const exercise = await newExercise.save()

        await Course.findByIdAndUpdate(
                req.body.courseId,
                { 
                  $push: {
                    exercises: exercise._id
                  }
                }
              )

        await Lesson.updateOne(
                { _id: req.body.lessonId },
                { 
                  $push: 
                  { 
                    exercises : exercise._id
                  }
                }
              )
        
        const students = await Course.findById(req.body.courseId, { students: 1, _id: 0 }).lean()
        
        const studentSubmission = students.students.map(e => { 
          var a = e;
          e = {};
          e.userId = a;
          return e
        })

        const subExercise = new SubExercise({
          exerciseId: exercise._id,
          studentSubmission: studentSubmission
        });

        await subExercise.save()

        res.json({'mes':"Tạo bài tập thành công"})
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/exercise/edit-exercise
// @desc    edit exercise
// @access  Private
router.post(
  '/edit-exercise',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddExerciseInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    async function run() {
      try {
        await Exercise.findByIdAndUpdate(
          req.body._id,
          {
            title: req.body.title,
            text: req.body.text,
            attachFiles: req.body.attachFiles,
            deadline: req.body.deadline,
            password: req.body.password
          }
        )

        res.json({'mes':"Chỉnh sửa bài tập thành công"})
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   GET api/exercises/:courseId
// @desc    Return exercise list
// @access  Private
router.get('/:courseId', (req, res) => {
  Course.findById(req.params.courseId).then(course => {
    Exercise.find({
        '_id': { $in: course.exercises}
    }, function(err, exercises){
      res.json(exercises)
    });
  })
});

// @route   Get api/exercises/get-comments/:exerciseId
// @desc    Get comments
// @access  Private
router.get(
  '/get-comments/:exerciseId',
  passport.authenticate('jwt', { session: false }), 
  (req, res) => {

  Exercise.findById(
    req.params.exerciseId ,
    { comments: 1 }
  )
  .populate('comments.user', '_id name email photo')
  .lean()
  .then(commments => res.json(commments))
  .catch(err => console.log(err));

});

// @route   POST api/exercises/comment/:exerciseId
// @desc    Comment on a exercise
// @access  Private
router.post('/comment/:exerciseId', passport.authenticate('jwt', { session: false }), (req, res) => {

  let errors = {};

  if (Validator.isEmpty(req.body.text)) {
    errors.text = 'Hãy nhập bình luận';
    return res.status(400).json(errors);
  }

  Exercise.findById(req.params.exerciseId).then(exercise=>{
    const newComment = {
      user: req.user.id,
      text: req.body.text
    }

    exercise.comments.push(newComment);
    exercise.save().then(res.json({'mes':"Bình luận của bạn đã được gửi"}));
  })
  .catch(err => res.status(404).json({ exercisenotfound: 'Không tìm thấy exercise' }));
});

// @route   Get api/exercises/exercise/:id
// @desc    Get 1 exercise
// @access  Private
router.get('/exercise/:id', (req, res) => {
  Exercise.findById(req.params.id, { title: 1 }).then(exercise => {
    res.json(exercise)
    //console.log(exercise)
  })
  .catch(err => res.status(404).json({ exercisenotfound: 'Không tìm thấy exercise' }));

});
// @route   Get api/exercises/exercisePoint/:id
// @desc    Get exercise points
// @access  Private
router.get('/exercisePointOP/:id', (req, res) => {
  SubExercise.findOne(
    { exerciseId: req.params.id }, 
    { studentSubmission: 1, _id:0 }
    
  ).populate('studentSubmission.userId', '_id name code photo')
  .then(studentSubmission => {
    res.json(studentSubmission)
  })
  .catch(err => res.status(404).json({ exercisenotfound: 'Không tìm thấy điểm của bài tập' }));

});
// @route   POST api/exercises/:exerciseId/submit
// @desc    submit a exercise
// @access  Private
router.post('/:exerciseId/submit', passport.authenticate('jwt', { session: false }), (req, res) => {
  
  let uploadedFile = req.files.file;
  let errors = {};

  if(uploadedFile.size > 20 * 1024 * 1024){
    errors.file = 'File phải nhỏ hơn 20 MB!'
    return res.status(404).json(errors);
  }
  var dir = './file_upload/' + req.params.exerciseId + '/' + req.user._id + '/'; 

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, {recursive: true}, err=>{});
  }

  async function run() {
    try {      
      const find = 
      await SubExercise.findOne(
        { 'exerciseId' : req.params.exerciseId },
        {
          studentSubmission:
          {
            $elemMatch: {
              'userId': req.user.id
            }
          }
        }
      )
 
      // ko tìm thấy học viên trong SubExercise
      if(find.studentSubmission.length === 0)
      {
        uploadedFile.mv(dir + uploadedFile.name, function(err) {
          if (err)
          {
            errors.file = 'Upload lỗi!'
            return res.status(404).json(errors);
          }
        });   
        const submission = {
                name: uploadedFile.name,
                url: dir + uploadedFile.name,
              }
        
        await
        SubExercise.findOneAndUpdate(
          {
            exerciseId: req.params.exerciseId
          },
          {
            $push: {
              studentSubmission: {
                userId: req.user.id,
                attachFile: submission,
                isSubmit: true,
                submitTime: Date.now()
              }
            }
          }
        )

        res.json({"mes":"Nộp bài tập thành công!"})

      }else{
        // đã nộp bài
        if(find.studentSubmission[0].isSubmit === true)
        {
          errors.file = 'Hãy xóa bài cũ trước khi nộp!'
          return res.status(404).json(errors);

        }else{

          uploadedFile.mv(dir + uploadedFile.name, function(err) {
            if (err)
            {
              errors.file = 'Upload lỗi!'
              return res.status(404).json(errors);
            }
          });   
          const submission = {
                  name: uploadedFile.name,
                  url: dir + uploadedFile.name
                }

          await
          SubExercise.updateOne(
            {
              exerciseId: req.params.exerciseId,  "studentSubmission.userId": req.user.id
            },
            {
              $set:         
              { 
                "studentSubmission.$.isSubmit" : true,
                "studentSubmission.$.attachFile" : submission,
                "studentSubmission.$.submitTime" : Date.now()
              }
            }
          )

          res.json({"mes":"Nộp bài tập thành công!"})
        }

      }
      
    } catch (err) {
      console.log(err)
    }
  }

  run();
});

// @route   POST api/exercises/:exerciseId/download
// @desc    download a submission to exercise
// @access  Private
router.get('/:exerciseId/download', passport.authenticate('jwt', { session: false }), (req, res) => {
  let file = fs.readdirSync('./file_upload/' + req.params.exerciseId + '/' + req.user.id )[0];
  //Path /file_upload/:userId/exerciseId/file
  return res.download('./file_upload/' + req.params.exerciseId + '/' + req.user.id + '/' + file);
});

// @route   POST api/exercises/:exerciseId/get-submission
// @desc    get a submission
// @access  Private
router.get('/:exerciseId/get-submission', passport.authenticate('jwt', { session: false }), (req, res) => {
  try{
    
    let fileName = fs.readdirSync('./file_upload/' + req.params.exerciseId + '/' + req.user.id)[0];
    res.json(fileName);
  }catch(e){
    res.json("")
  }
  //Path /file_upload/:userId/exerciseId/file
});

// @route   POST api/exercises/:exerciseId/get-submission
// @desc    get a submission
// @access  Private
router.get('/:exerciseId/get-submissionTai', passport.authenticate('jwt', { session: false }),(req, res) => {
  //console.log('abc');
  try{
    let userName = fs.readdirSync('./file_upload/' + req.params.exerciseId);
    var a =[];
    var name_array = [1,31,2];
    for (var i = 0; i < userName.length; i++){
    let fileName = fs.readdirSync('./file_upload/' + req.params.exerciseId+'/'+userName[i]);
    a.push(fileName);
    }

    
    res.json(a);
  }catch(e){
    res.json("")
  }
  //console.log('abc');
  //Path /file_upload/:userId/exerciseId/file
});

router.delete('/:exerciseId/delete', passport.authenticate('jwt', { session: false }), (req, res) => {
  async function run() {
    try{
      await rimraf.sync('./file_upload/' + req.params.exerciseId + '/' + req.user.id);

      await
      SubExercise.updateOne(
        {
          exerciseId: req.params.exerciseId, "studentSubmission.userId": req.user.id
        },
        {
          $set:         
          { 
            "studentSubmission.$.isSubmit" : false
          },
          $unset:
          {
            "studentSubmission.$.attachFile" : '',
            "studentSubmission.$.submitTime" : ''
          }
        }
      )

      res.json("Đã xóa");
    }catch(e){
      console.log(e);
      res.json("Không thể xóa");
    }
  }

  run();
});

// @route   POST api/exercises/:exerciseId/get-my-submission
// @desc    get my submission
// @access  Private
router.get('/:exerciseId/get-my-submission', passport.authenticate('jwt', { session: false }),(req, res) => {
  async function run() {
    try {      
      const sub = 
      await SubExercise.findOne(
        { 'exerciseId' : req.params.exerciseId },
        {
          studentSubmission:
          {
            $elemMatch: {
              'userId': req.user.id
            }
          }
        }
      )
      .lean()

      if(sub.studentSubmission === undefined || sub.studentSubmission.length === 0)
      {
        var rep = {
          isSubmit: false,
          exerciseId: req.params.exerciseId
        }
        res.json(rep)
      }else{
        sub.studentSubmission[0].exerciseId = req.params.exerciseId
        res.json(sub.studentSubmission[0])
      }

    } catch (err) {
      console.log(err)
    }
  }

  run();
});

module.exports = router;