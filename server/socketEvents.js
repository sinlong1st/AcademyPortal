const LessonList = require('./models/LessonList');
const Course = require('./models/Course');
const School = require('./models/School');
const Lesson = require('./models/Lesson');
const Exercise = require('./models/Exercise');
const Attendance = require('./models/Attendance');
const Quiz = require('./models/Quiz');
const User = require('./models/User');
const Certification = require('./models/Certification');
const Infrastructure = require('./models/Infrastructure');
const QuizBank = require('./models/QuizBank');
const isEmpty = require('./validation/is-empty')

exports = module.exports = (io) => {

  io.on("connection", socket => {
    
    socket.on("lesson_list", () => {
      LessonList.find({},'title lesson._id lesson.text created')
      .populate('certification','name')
      .sort({created: -1})
      .then(list => {
        io.sockets.emit("get_lesson_list", list);
      });
    });
    //////////////////////////////////////////////

    socket.on("list", (listId) => {
      LessonList.findById(listId)
      .populate('certification','name')
      .then(list => {
        io.sockets.emit("get_list", list);
      });
    });
    //////////////////////////////////////////////

    socket.on("all_course", () => {
      Course.find(
        { 'enrollDeadline' : {$gte : new Date()}},
        { coursePhoto: 1, title: 1, intro: 1, enrollDeadline: 1, code: 1, maxStudent:1, students: 1 }
      )
      .populate('infrastructure')
      .sort({created: -1})
      .then(courses => io.sockets.emit("get_all_course", courses))
    });
    //////////////////////////////////////////////

    socket.on("course_info", (courseId) => {
      async function run() {
        try {
          var course = await 
          Course.findById( courseId, { coursePhoto: 1, title: 1, intro: 1, enrollDeadline: 1, pointColumns: 1, code: 1, days: 1, students: 1, teachers: 1, minScore:1, minAbsent: 1, certification: 1 })
                .populate('teachers','name photo email teacherDegree teacherIntro teacherRating')
                .populate('certification','name')
                .populate('infrastructure')
                .lean()
  
          var course_detail = await  
          CourseDetail.findOne(
            { 'courseId' : courseId },
            { studyTime: 1, openingDay: 1, endDay: 1, fee: 1, info: 1, isFull: 1, maxStudent: 1, minStudent: 1 }
          ).lean()
  
          var schedule = await
          Schedule.findOne(
            { courseId: courseId }
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
            schedule
          }
  
          io.sockets.emit("get_course_info", result)
        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });
    //////////////////////////////////////////////

    socket.on("student_approve_list", (courseId) => {

      async function run() {
        try {
  
          const coursedetail = await 
            CourseDetail.findOne(
              { 'courseId' : courseId } ,
              { enrollStudents: 1 , maxStudent: 1, minStudent: 1, isFull: 1, isNotifyMail: 1 }
            )
            .populate('enrollStudents.student', '_id name email photo code phone')
            .lean()
          
          const course = await 
            Course.findById(
              courseId  ,
              { enrollDeadline: 1, code: 1, title: 1 }
            )
            .lean()
  
          const result = {
            courseId: courseId,
            code: course.code,
            title: course.title,
            enrollDeadline: course.enrollDeadline,
            enrollStudents: coursedetail.enrollStudents,
            maxStudent: coursedetail.maxStudent,
            minStudent: coursedetail.minStudent,
            isFull: coursedetail.isFull,
            isNotifyMail: coursedetail.isNotifyMail          
          }
          io.sockets.emit("get_student_approve_list", result)
          
        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });
    //////////////////////////////////////////////

    socket.on("school", () => {
      School.find()
      .then(school => {
        io.sockets.emit("get_school", school[0]);
      });
    });
    //////////////////////////////////////////////

    socket.on("schedule", (courseId) => {
      async function run() {
        try {
          const schedule = await 
          Schedule.findOne(
            { courseId: courseId }
          )
          .populate('events.lessonId','text')
          .lean()
  
          schedule.events.map(e=>{
            e.text = e.lessonId.text
            e.lessonId = e.lessonId._id
          })

          io.sockets.emit("get_schedule", schedule);

        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });
    //////////////////////////////////////////////

    socket.on("event_schedule", (dataId) => {
      async function run() {
        try {
          const schedule = await 
          Schedule.findOne(
            { 
              courseId: dataId.courseId
            },
            {
              events: { $elemMatch: { _id: dataId.eventId }}
            }
          )
          .populate({
            path: 'events.exercises'
          })
          .populate({
            path: 'events.quizzes.quizId'
          })

          io.sockets.emit("get_event_schedule", schedule.events[0]);

        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });
    //////////////////////////////////////////////

    socket.on("lesson_in_course", (dataId) => {
      Lesson.findOne({ _id: dataId.lessonId, courseId: dataId.courseId })
      .populate({
        path: 'exercises'
      })
      .populate({
        path: 'quizzes.quizId'
      })
      .then(lesson => io.sockets.emit("get_lesson_in_course", lesson))
      .catch(err => console.log(err));
    });
    //////////////////////////////////////////////

    socket.on("comments", (exerciseId) => {
      Exercise.findById(
        exerciseId ,
        { comments: 1 }
      )
      .populate('comments.user', '_id name email photo')
      .lean()
      .then(commments => io.sockets.emit("get_comments", commments))
      .catch(err => console.log(err));
    });
    //////////////////////////////////////////////

    socket.on("today_attendance", (data) => {
      Attendance.findOne(
        { 
          'courseId' : data.courseId,
          'date' : data.selectDate
        }
      )
      .populate('students.userId', '_id name email photo code')
      .then(attendance => io.sockets.emit("get_today_attendance", attendance))
      .catch(err => console.log(err));
    });
    //////////////////////////////////////////////

    socket.on("attendance", (courseId) => {
      Attendance.find(
        { 
          'courseId' : courseId
        }
      )
      .populate('students.userId', '_id name email photo code')
      .then(attendance => {
        var data ={
          attendance,
          courseId
        }
        io.sockets.emit("get_attendance", data)
      })
      .catch(err => console.log(err));
    });
    //////////////////////////////////////////////

    socket.on("quiz", () => {
      Quiz.find({}, { title: 1, time: 1, created: 1 })
      .sort({created: -1})
      .then(quiz => {
        io.sockets.emit("get_quiz", quiz)
      })
      .catch(err => console.log(err));
    });

    //////////////////////////////////////////////

    socket.on("accounts", () => {
      async function run() {
        try {
          const user = await 
          User.find({ $or: [ { role: 'admin'}, {role: 'manager'}, {role: 'ministry'}, {role: 'educator'}, {role: 'teacher'} ] })
              .sort({created: -1})      

          io.sockets.emit("get_accounts", user);

        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });

    //////////////////////////////////////////////

    socket.on("student_accounts", () => {
      async function run() {
        try {
          const user = await 
          User.find({ role: 'student' })
              .sort({created: -1})      

          io.sockets.emit("get_student_accounts", user);

        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });
    
    //////////////////////////////////////////////

    socket.on("manage_courses", () => {
      async function run() {
        try {
          const courses = await 
          Course.find({},{coursePhoto: 1, title: 1, code: 1, coursedetail: 1, created: 1})
                .sort({created: -1})
                .populate('coursedetail', 'openingDay endDay')
                .populate('infrastructure')

          io.sockets.emit("get_manage_courses", courses);

        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });

    //////////////////////////////////////////////

    socket.on("statistic", (courseId) => {
      async function run() {
        try {
          const courses = await 
          Course.findById(courseId ,{ students: 1, minAbsent: 1, minScore: 1 })
                .populate('students', 'photo name code')
                .lean()

          for(var i=0; i < courses.students.length; i++)
          {
            var point = await
              Course.findById(
                courseId,
                { pointColumns: 1 }
              )
              .populate({
                path: 'pointColumns.submit',
                match: { 'studentSubmission.userId': courses.students[i]._id },
                select: { 
                  studentSubmission:  
                  {
                    $elemMatch: {
                      'userId': courses.students[i]._id 
                    }
                  }
                }
              })

            var totalPoint = 0; 
            for(var j=0; j<point.pointColumns.length; j++)
            {
              if(!isEmpty(point.pointColumns[j].submit) )
                if(!isEmpty(point.pointColumns[j].submit.studentSubmission[0].point))
                  totalPoint = totalPoint + point.pointColumns[j].submit.studentSubmission[0].point * point.pointColumns[j].pointRate / 100
            }
              
            courses.students[i].totalPoint = totalPoint.toFixed(1)
          }

          for(var i=0; i < courses.students.length; i++)
          {
            var attendance = await
            Attendance.find(
              {
                'courseId': courseId,
                students: { $elemMatch: { 'userId': courses.students[i]._id, isPresent: false } } 
              },
              {date: 1}
            );

            courses.students[i].absent = attendance.length
          }

          courses.passStudent = [];
          courses.failStudent = [];

          for(var i=0; i < courses.students.length; i++)
          {
            if(courses.students[i].totalPoint >= courses.minScore && courses.students[i].absent <= courses.minAbsent)
              courses.passStudent.push(courses.students[i])
            else
              courses.failStudent.push(courses.students[i])
          }

          io.sockets.emit("get_statistic", courses);

        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });

    //////////////////////////////////////////////

    socket.on("course", (courseId) => {
      async function run() {
        try {
  
          var course = await 
          Course.findById( courseId, { coursePhoto: 1, title: 1, code: 1, certification: 1 })
                .populate('certification','name')
                .lean()
                
          io.sockets.emit("get_course", course)
        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });

    /////////////////////////////////////////////
    socket.on("infrastructure", () => {
      async function run() {
        try {
  
          var infrastructure = await Infrastructure.find();
                
          io.sockets.emit("get_infrastructure", infrastructure)
        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });

    /////////////////////////////////////////////
    socket.on("quizbank", () => {
      async function run() {
        try {
  
          var quizbank = await QuizBank.find().sort({created: -1});
                
          io.sockets.emit("get_quizbank", quizbank)
        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });

    
    //////////////////////////////////////////////

    socket.on("category", (categoryId) => {
      async function run() {
        try {
  
          var category = await 
          QuizBank.findById(categoryId)
                  .populate('listQuiz.creator', '_id name email photo')
                  .lean()
                
          io.sockets.emit("get_category", category)
        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });

    //////////////////////////////////////////////

    socket.on("teachers_rating", (courseId) => {
      async function run() {
        try {
  
          var course = await 
          Course.findById(courseId)
                  .populate({
                    path : 'teachers',
                    select: 'code photo name teacherRating',
                    populate : {
                      path : 'teacherRating.user',
                      select: 'code photo name'
                    }
                  })
                  .lean()
                  
          for(var i=0;i<course.teachers.length;i++)
          {
            var a = []
            for(var j=0;j < course.teachers[i].teacherRating.length; j++)
            {
              if(course.teachers[i].teacherRating[j].course.toString() === courseId.toString())
                a.push(course.teachers[i].teacherRating[j])
            }
            course.teachers[i].teacherRating = a
          }

          io.sockets.emit("get_teachers_rating", course)
        } catch (err) {
          console.log(err)
        }
      }
  
      run();
    });

  });
}