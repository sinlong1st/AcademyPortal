const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
var cloudinary = require('cloudinary');
require('dotenv').config();
const formData = require('express-form-data');
const moment = require('moment');

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET 
});


// Load Input Validation
const validateAddCourseInput = require('../../validation/addcourse');
const validateEditCourseInput = require('../../validation/editcourse');


// Course Model
const Course = require('../../models/Course');
const CourseDetail = require('../../models/CourseDetail');
const User = require('../../models/User');
const SubExercise = require('../../models/SubExercise');
const SubQuiz = require('../../models/SubQuiz');
const Schedule = require('../../models/Schedule');
const LessonList = require('../../models/LessonList');
const Lesson = require('../../models/Lesson');
const School = require('../../models/School');

const sendEmail = require('../../email/email.send')
const changedate = require('../../email/email.changedate')

router.use(cors());
router.use(formData.parse())


// @route   POST api/courses/add-course
// @desc    add course
// @access  Private
router.post(
  '/add-course',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddCourseInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    const newCourse = new Course({
      code: req.body.code,
      title: req.body.title,
      enrollDeadline: req.body.enrollDeadline,
      intro: req.body.intro,
      pointColumns: req.body.pointColumns,
      maxStudent: req.body.maxStudent,
      days: req.body.days,
      infrastructure: req.body.infrastructure,
      minScore: req.body.minScore,
      minAbsent: req.body.minAbsent
    });

    const newCourseDetail = new CourseDetail({
      studyTime: req.body.studyTime,
      openingDay: req.body.openingDay,
      endDay: req.body.endDay,
      fee: req.body.fee,
      info: req.body.info,
      maxStudent: req.body.maxStudent,
      minStudent: req.body.minStudent
    });

    async function run() {
      try {
        const findCode = await Course.findOne({ code: req.body.code })

        if (findCode) {
          errors.code = 'Hãy điền mã khóa học';
          return res.status(404).json(errors);
        }
        
        // Tạo khóa học
        const course = await newCourse.save()

        await 
        User.updateMany(
          { 'role' : 'admin' } ,
          { 
            $push: {
              courses: course._id
            }
          }
        )

        // lấy danh sách bài học 
        const lessonlist = await LessonList.findById(req.body.listId);

        // ánh xạ bài học vào ngày học
        var events = req.body.events
        for( var i=0; i < events.length; i++ )
        {
          var newLesson = new Lesson({
            courseId: course._id,
            rootId: lessonlist.lesson[i]._id,
            text: lessonlist.lesson[i].text,
            content: lessonlist.lesson[i].content,
            files: lessonlist.lesson[i].files,
          });

          var lesson = await newLesson.save()
          events[i].lessonId = lesson._id
        }

        const newSchedule = new Schedule({
          events: events
        });

        newCourseDetail.courseId = course._id
        newSchedule.courseId = course._id
        await newSchedule.save();
        const coursedetail = await newCourseDetail.save() 

        await Course.findByIdAndUpdate(
          course._id,
          {
            $set: 
            {
              certification : lessonlist.certification,
              coursedetail : coursedetail._id
            }
          }
        )

        res.json(coursedetail)
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/courses/edit-course/:courseId
// @desc    edit course
// @access  Private
router.post(
  '/edit-course/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEditCourseInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    async function run() {
      try {
        const course = await Course.findById(req.params.courseId)

        if(Number(req.body.maxStudent) > course.students.length)
        {
          await 
          CourseDetail.findOneAndUpdate(
            { 'courseId' : req.params.courseId },
            {
              $set: 
              {
                isFull: false
              }
            }
          )
        }else{
          await 
          CourseDetail.findOneAndUpdate(
            { 'courseId' : req.params.courseId },
            {
              $set: 
              {
                isFull: true
              }
            }
          )
        }

        if(req.body.events === '')
        {
          await 
          Course.findByIdAndUpdate(
            req.params.courseId,
            {
              $set: 
              {
                title: req.body.title,
                enrollDeadline: req.body.enrollDeadline,
                intro: req.body.intro,
                pointColumns: req.body.pointColumns,
                maxStudent: req.body.maxStudent,
                infrastructure: req.body.infrastructure,
                minScore: req.body.minScore,
                minAbsent: req.body.minAbsent
              }
            }
          )
  
          await 
          CourseDetail.findOneAndUpdate(
            { 'courseId' : req.params.courseId },
            {
              $set: 
              {
                fee: req.body.fee,
                info: req.body.info,
                openingDay: req.body.openingDay,
                endDay: req.body.endDay,
                maxStudent: req.body.maxStudent,
                minStudent: req.body.minStudent
              }
            }
          )
        }else{

          var schedule = await
          Schedule.findOne(
            { courseId: req.params.courseId }
          )
          .lean()

          var newEvents = req.body.events;
          var oldEvents = schedule.events;
          for(var i=0; i<oldEvents.length; i++)
          {
            oldEvents[i].start = newEvents[i].start
            oldEvents[i].end = newEvents[i].end
            oldEvents[i].date = newEvents[i].date
            oldEvents[i].time = newEvents[i].time

          }

          await
          Schedule.findOneAndUpdate(
            { courseId: req.params.courseId },
            {
              $set: 
              {
                events: oldEvents
              }
            }
          )

          await 
          Course.findByIdAndUpdate(
            req.params.courseId,
            {
              $set: 
              {
                title: req.body.title,
                enrollDeadline: req.body.enrollDeadline,
                intro: req.body.intro,
                pointColumns: req.body.pointColumns,
                maxStudent: req.body.maxStudent,
                days: req.body.days,
                infrastructure: req.body.infrastructure,
                minScore: req.body.minScore,
                minAbsent: req.body.minAbsent
              }
            }
          )
  
          await 
          CourseDetail.findOneAndUpdate(
            { 'courseId' : req.params.courseId },
            {
              $set: 
              {
                fee: req.body.fee,
                info: req.body.info,
                openingDay: req.body.openingDay,
                endDay: req.body.endDay,
                maxStudent: req.body.maxStudent,
                minStudent: req.body.minStudent
              }
            }
          )

          // gửi mail thông báo dời lịch khai giảng
          const school = await School.find();

          const course = await 
          Course.findById(
            req.params.courseId, 
            { students: 1, title: 1, code: 1 }
          )
          .populate('students', '_id name email')
          .lean()
  
          await
          course.students.forEach(student=>{
            sendEmail(student.email, changedate.confirm(student, course, school[0], moment(req.body.openingDay).format("[ngày] DD [tháng] MM, YYYY")))
          })

        }

        
        res.json("Chỉnh sửa khóa học thành công")
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   post api/courses/add-course-avatar/:courseId
// @desc    add course avatar
// @access  Private
router.post(
  '/add-course-avatar/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    var fileGettingUploaded = req.files.image.path;
    cloudinary.uploader.upload(fileGettingUploaded, function(result) {
      Course.updateOne(
        { _id: req.params.courseId },
        { $set:
          {
            coursePhoto: result.secure_url,
          }
        }
      )
     .then(course => res.json(course));
    });
  }
);

// @route   GET api/courses/all-course
// @desc    lấy hết khóa học chưa hết hạn ghi danh
// @access  Private
router.get(
  '/all-course',
  // passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Course.find(
      { 'enrollDeadline' : {$gte : new Date()}},
      {coursePhoto: 1, title: 1, intro: 1, enrollDeadline: 1, code: 1, maxStudent:1, students: 1}
    )
    .populate('infrastructure')
    .sort({created: -1})
    .then(courses => res.json(courses))
    .catch(err => console.log(err));
  }
);

// @route   GET api/courses/guest-course-info/:courseId
// @desc    lấy thông tin chi tiết của khóa học cho guest
// @access  Public


// @route   GET api/courses/course-info/:courseId
// @desc    lấy thông tin chi tiết của khóa học
// @access  Private
router.get(
  '/course-info/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        var course = await 
        Course.findById(req.params.courseId, {coursePhoto: 1, title: 1, intro: 1, enrollDeadline: 1, pointColumns: 1, code:1, days:1, students: 1 })
        .populate('infrastructure')
        .lean();
        var course_detail = await  
        CourseDetail.findOne(
          { 'courseId' : req.params.courseId },
          { studyTime: 1, openingDay: 1, endDay: 1, fee: 1, info: 1, isFull: 1, maxStudent: 1, minStudent: 1,
            enrollStudents:  
            {
              $elemMatch: {
                'student': req.user.id
              }
            }
          }
        ).lean()

        var schedule = await
        Schedule.findOne(
          { courseId: req.params.courseId }
        )
        .populate('events.lessonId','text')
        .lean()

        schedule.events.map(e=>{
          e.text = e.lessonId.text
          e.lessonId = e.lessonId._id
        })

        const result = {
          course,
          course_detail,
          schedule,
          isEnroll: true
        }       

        if(result.course_detail.enrollStudents === undefined)
        {
          result.isEnroll = false
        }

        res.json(result)
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   GET api/courses/current
// @desc    Return current user courses
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  Course.find({ '_id': { $in: req.user.courses} })
        .populate('coursedetail', 'openingDay endDay')
        .populate('infrastructure')
        .sort({created: -1})
        .then(courses => res.json(courses));
});

// @route   GET api/courses/get-active-course
// @desc    Return current user courses
// @access  Private
router.get('/get-active-course', (req, res) => {

  async function run() {
    try {

      var course_detail = await CourseDetail.find(
                                  {
                                    "endDay" : { "$gte": new Date() }
                                  },
                                  { courseId: 1, _id: 0 }
                                ).lean();

      var course_detail = await course_detail.map(elem => { 
        return elem = elem.courseId
      })

      var course = await Course.find(
                                      { '_id': { $in: course_detail} },
                                      'title coursePhoto created code'
                                )
                                .populate('infrastructure')
                               .sort({created: -1})
      res.json(course)
    } catch (err) {
      console.log(err)
    }
  }

  run();
});

// @route   GET api/courses/manage-courses
// @desc    lấy hết khóa học để admin chỉnh sữa
// @access  Private
router.get(
  '/manage-courses',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Course.find({},{coursePhoto: 1, title: 1, code: 1})
    .populate('infrastructure')
    .then(courses => {
      res.json(courses)
    })
    .catch(err => console.log(err));
  }
);

// @route   GET api/courses/:studentId
// @desc    Return current user courses
// @access  Private
router.get('/:studentId', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.params.studentId)
  .then(student =>{
    Course.find({'_id': { $in: student.courses}})
          .populate('infrastructure')
          .sort({created: -1})
          .then(courses => res.json(courses));
  });
});

// @route   POST api/courses/enroll-course/:courseId
// @desc    enroll course
// @access  Private
router.post(
  '/enroll-course/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        // console.log(req.body)
        await 
        CourseDetail.findOneAndUpdate(
          { 'courseId' : req.params.courseId },
          { 
            $push: {
              enrollStudents: {
                student: req.user.id,
                paymentMethod: req.body.paymentMethod,
                paymentDetail: req.body.paymentDetail
              }
            }
          }
        )

        await 
        Course.findByIdAndUpdate(
          req.params.courseId ,
          { 
            $push: {
              students: req.user.id
            }
          }
        )

        await
        User.findByIdAndUpdate(
          req.user.id ,
          { 
            $push: {
              courses: req.params.courseId
            }
          }
        )

        res.json({ mes: 'Ghi danh thành công vào khóa học' })
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/courses/unenroll-course/:courseId
// @desc    unenroll course
// @access  Private
router.post(
  '/unenroll-course/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    CourseDetail.findOneAndUpdate(
      { 'courseId' : req.params.courseId },
      { 
        $pull: {
          enrollStudents: {
            student: req.user.id
          }
        }
      }
    )
    .then(coursedetail => res.json(coursedetail))
    .catch(err => console.log(err));
  }
);

// @route   POST api/courses/approve/student/:courseId/:studentId
// @desc    approve student
// @access  Private
router.post(
  '/approve/student/:courseId/:studentId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        await 
        CourseDetail.findOneAndUpdate(
          { 'courseId' : req.params.courseId },
          { 
            $pull: {
              enrollStudents: {
                student: req.params.studentId
              }
            }
          }
        )

        await 
        Course.findByIdAndUpdate(
          req.params.courseId ,
          { 
            $push: {
              students: req.params.studentId
            }
          }
        )
        
        await
        User.findByIdAndUpdate(
          req.params.studentId ,
          { 
            $push: {
              courses: req.params.courseId
            }
          }
        )

        res.json("Duyệt thành công")
      }catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/courses/approve/teacher/:courseId/:teacherId
// @desc    approve teacher
// @access  Private
router.post(
  '/approve/teacher/:courseId/:teacherId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {

        const find = 
        await
        Course.find(
          { _id: req.params.courseId, teachers: req.params.teacherId }
        )

        if(find.length !== 0)
        {
          let errors = {
            err : 'Giáo viên đã được thêm'
          }
          return res.status(400).json(errors);
        }
        
        await 
        Course.findByIdAndUpdate(
          req.params.courseId ,
          { 
            $push: {
              teachers: req.params.teacherId
            }
          }
        )
        
        await
        User.findByIdAndUpdate(
          req.params.teacherId ,
          { 
            $push: {
              courses: req.params.courseId
            }
          }
        )

        res.json("Duyệt thành công")
      }catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/courses/delete/teacher/:courseId/:teacherId
// @desc    delete teacher
// @access  Private
router.post(
  '/delete/teacher/:courseId/:teacherId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {

        await 
        Course.findByIdAndUpdate(
          req.params.courseId ,
          { 
            $pull: {
              teachers: req.params.teacherId
            }
          }
        )
        
        await
        User.findByIdAndUpdate(
          req.params.teacherId ,
          { 
            $pull: {
              courses: req.params.courseId
            }
          }
        )

        res.json("Duyệt thành công")
      }catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/courses/join-course/:courseId
// @desc    join course
// @access  Private
router.post(
  '/join-course/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {

        const isJoin = await User.find({'_id': req.user.id, 'courses': req.params.courseId})

        if(isJoin.length === 0)
        {
          if(req.user.role === 'teacher')
          {
            await 
            Course.findByIdAndUpdate(
              req.params.courseId ,
              { 
                $push: {
                  teachers: req.user.id
                }
              }
            )
          }
  
          await
          User.findByIdAndUpdate(
            req.user.id ,
            { 
              $push: {
                courses: req.params.courseId
              }
            }
          )
  
          res.json("Tham gia khóa học thành công")
        }else{

          res.json("Đã tham gia vào khóa học này")
        }
      }catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   GET api/courses/get-point-columns/:courseId
// @desc    lấy cột điểm trong khóa học
// @access  Private
router.get(
  '/get-point-columns/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Course.findById(
      req.params.courseId,
      {pointColumns: 1}
    )
    .populate('pointColumns.test','title')
    .then(course => res.json(course))
    .catch(err => console.log(err));
  }
);

// @route   GET api/courses/set-point-colums-exercise/:courseId/:pointColumnsId/:exerciseId
// @desc    gán bài cho cột điểm
// @access  Private
router.get(
  '/set-point-colums-exercise/:courseId/:pointColumnsId/:exerciseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        const subexerciseId = await SubExercise.findOne({ 'exerciseId' : req.params.exerciseId }, { _id : 1 })

        await Course.updateOne(
          { _id: req.params.courseId, "pointColumns._id": req.params.pointColumnsId },
          { 
            $set: 
            { 
              "pointColumns.$.test" :  req.params.exerciseId,
              "pointColumns.$.testModel" :  'exercises',
              "pointColumns.$.submit" :  subexerciseId._id,
              "pointColumns.$.submitModel" :  'subexcercise',              
            } 
          }
        )
        .catch(err => console.log(err));

        res.json({ mes: "Chọn bài tập thành công" })
      }catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   GET api/courses/set-point-colums-quiz/:courseId/:pointColumnsId/:quizId
// @desc    gán bài cho cột điểm
// @access  Private
router.get(
  '/set-point-colums-quiz/:courseId/:pointColumnsId/:quizId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        const subquizId = await SubQuiz.findOne({ 'quizId' : req.params.quizId, 'courseId' : req.params.courseId}, { _id : 1 })

        await Course.updateOne(
          { _id: req.params.courseId, "pointColumns._id": req.params.pointColumnsId },
          { 
            $set: 
            { 
              "pointColumns.$.test" :  req.params.quizId,
              "pointColumns.$.testModel" :  'quizzes',
              "pointColumns.$.submit" :  subquizId._id,
              "pointColumns.$.submitModel" :  'subquiz',              
            } 
          }
        )
        .catch(err => console.log(err));

        res.json({ mes: "Chọn trắc nghiệm thành công" })
      }catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   GET api/courses/get-point-columns-student/:courseId/:studentId
// @desc    lấy cột điểm trong khóa học
// @access  Private
router.get(
  '/get-point-columns-student/:courseId/:studentId',
  // passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Course.findById(
      req.params.courseId,
      {pointColumns: 1}
    )
    .populate({
      path: 'pointColumns.submit',
      match: { 'studentSubmission.userId': req.params.studentId },
      select: { 
        studentSubmission:  
        {
          $elemMatch: {
            'userId': req.params.studentId 
          }
        }
      }
    })
    .populate('pointColumns.test','title')
    .then(course => res.json(course))
    .catch(err => console.log(err));
  }
);

module.exports = router;