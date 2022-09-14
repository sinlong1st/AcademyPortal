const express = require('express');
const router = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const passport = require('passport');
require('dotenv').config()
const moment = require('moment');
const isEmpty = require('../../validation/is-empty')

const formData = require('express-form-data')
var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET 
});

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const validateProfileInput = require('../../validation/profile');
const validateChangePasswordInput = require('../../validation/password');
const validateAddStudentInput = require('../../validation/addStudent');
const validateLoginLMSInput = require('../../validation/loginLMS');
const validateResetPasswordInput = require('../../validation/resetPassword');


// User Model
const User = require('../../models/User');
const Course = require('../../models/Course');
const CourseDetail = require('../../models/CourseDetail');
const School = require('../../models/School');

router.use(cors());
router.use(formData.parse())

const sendEmail = require('../../email/email.send')
const templates = require('../../email/email.templates')
const notify = require('../../email/email.notify')
const resetpassword = require('../../email/email.resetpassword')
const info = require('../../email/email.info')

// @route   POST api/users/register
// @desc    Register User
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  async function run() {
    try {
      const findCard = await User.findOne({ idCard: req.body.idCard })

      if (findCard) {
        errors.idCard = 'CMND đã được dùng để tạo tài khoản';
        return res.status(404).json(errors);
      }

      const findEmail = await User.findOne({ email: req.body.email })

      if (findEmail) {
        errors.email = 'Email đã tồn tại';
        return res.status(400).json(errors);
      }

      if(req.body.role === 'student')
      {
        var date = new Date();
        let code = 'hv' + date.getFullYear().toString().slice(2,4) + req.body.idCard;
        var newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          phone: req.body.phone,
          idCard: req.body.idCard,
          code: code
        });
      }else{

        if(req.body.code === '')
        {
          let errors = {};
          errors.code = 'Mã đăng nhập không được bỏ trống'
          return res.status(400).json(errors);
        }

        const find = 
        await
        User.findOne(
          { code : req.body.code }
        )
  
        if(find)
        {
          let errors = {};
          errors.code = 'Mã này đã tồn tại'
          return res.status(400).json(errors);
        }

        var newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          role: req.body.role,
          confirmed: true,
          phone: req.body.phone,
          code: req.body.code,
          idCard: req.body.idCard
        });
      }

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user=>{
              if(req.body.role === 'student')
              {
                sendEmail(user.email, templates.confirm(user._id, user.name))
                .then(res.json({mes:"Tạo tài khoản thành công"}))
                .catch(err => console.log(err));
              }else{
                res.json({mes:"Tạo tài khoản thành công"})
              }
            })
            .catch(err => console.log(err));
        });
      });

    } catch (err) {
      console.log(err)
    }
  }

  run();

});

router.post('/start', (req, res) => {

  async function run() {
    try {

      const findAdmin = await User.findOne({ role: 'admin' })

      if (findAdmin) {
        return res.json({ mes:"Đã tạo tài khoản" });
      }

      var admin = new User({
        name: 'admin',
        password: '123456',
        role: 'admin',
        code: 'admin'
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(admin.password, salt, (err, hash) => {
          if (err) throw err;
          admin.password = hash;
          admin.save();
        });
      });

      var manager = new User({
        name: 'giám đốc',
        password: '123456',
        role: 'manager',
        code: 'giamdoc'
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(manager.password, salt, (err, hash) => {
          if (err) throw err;
          manager.password = hash;
          manager.save();
        });
      });

      res.json({ mes:"Tạo tài khoản thành công" });

    } catch (err) {
      console.log(err)
    }
  }

  run();

});

router.post('/create_payment_url', function (req, res) {
  var ipAddr = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

  var dateFormat = require('dateformat');

  var tmnCode = process.env.vnp_TmnCode
  var secretKey = process.env.vnp_HashSecret
  var vnpUrl = process.env.vnp_Url
  var returnUrl = process.env.vnp_ReturnUrl

  var date = new Date();

  var createDate = dateFormat(date, 'yyyymmddHHmmss');
  var orderId = dateFormat(date, 'HHmmss');
  var amount = req.body.amount;
  var bankCode = req.body.bankCode;
  var orderInfo = req.body.courseId;
  var orderType = '190000';
  var locale = 'vn';
  var currCode = 'VND';
  var vnp_Params = {};
  vnp_Params['vnp_Version'] = '2';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale;
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = orderType;
  vnp_Params['vnp_Amount'] = amount * 100;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if(bankCode !== null && bankCode !== ''){
      vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  var querystring = require('qs');
  var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

  var sha256 = require('sha256');

  var secureHash = sha256(signData);

  vnp_Params['vnp_SecureHashType'] =  'SHA256';
  vnp_Params['vnp_SecureHash'] = secureHash;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });

  res.json(vnpUrl)
});

function sortObject(o) {
  var sorted = {},
      key, a = [];

  for (key in o) {
      if (o.hasOwnProperty(key)) {
          a.push(key);
      }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
      sorted[a[key]] = o[a[key]];
  }
  return sorted;
}


router.get('/vnpay_return', passport.authenticate('jwt', { session: false }), function (req, res) {
  var vnp_Params = req.query;

  if(vnp_Params['vnp_ResponseCode'] === '00'){

    async function run() {
      try {

        const find = 
        await
        Course.find(
          { _id : vnp_Params['vnp_OrderInfo'], students: req.user.id }
        )
        
        if(find.length === 0)
        {
        
          await 
          CourseDetail.findOneAndUpdate(
            { 'courseId' : vnp_Params['vnp_OrderInfo'] },
            { 
              $push: {
                enrollStudents: {
                  student: req.user.id,
                  paymentMethod: 'Thanh toán trực tuyến'
                }
              }
            }
          )
  
          const course = 
          await 
          Course.findByIdAndUpdate(
            vnp_Params['vnp_OrderInfo'] ,
            { 
              $push: {
                students: req.user.id
              }
            }
          )
  
          const user = 
          await
          User.findByIdAndUpdate(
            req.user.id ,
            { 
              $push: {
                courses: vnp_Params['vnp_OrderInfo']
              }
            }
          )
          
          const coursedetail = 
          await
          CourseDetail.findOne(
            { 'courseId' : vnp_Params['vnp_OrderInfo'] },
            { maxStudent: 1, enrollStudents: 1, openingDay: 1 }
          )
  
          if(coursedetail.enrollStudents.length >= coursedetail.maxStudent)
            await 
            CourseDetail.findOneAndUpdate(
              { 'courseId' : vnp_Params['vnp_OrderInfo'] },
              { isFull: true }
            )

          const school = await School.find();
          
          await
          sendEmail(user.email, info.confirm(user, course, school[0], moment(coursedetail.openingDay).format("[ngày] DD [thg] MM, YYYY")))

        }
        const result = {
          studentCode: req.user.code,
          courseId: vnp_Params['vnp_OrderInfo']
        }
        res.json(result)

      } catch (err) {
        console.log(err)
      }
    }
    run();
  }
});

// @route   POST api/users/add-student
// @desc    Add student
// @access  Public
router.post('/add-student', (req, res) => {
  const { errors, isValid } = validateAddStudentInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  async function run() {
    try {

      const course =         
      await 
      CourseDetail.findOne(
        { 'courseId' : req.body.courseId },
        { isFull : 1 }
      )

      if(course.isFull === true)
      {
        let errors = {};
        errors.password2 = 'Lớp học đã đạt số thành viên tối đa không thể thêm!'
        return res.status(400).json(errors);
      }

      const find = await User.findOne({ email: req.body.email })
      if (find) {
        errors.email = 'Email đã tồn tại';
        return res.status(400).json(errors);
      } 
      
      const find2 = await User.findOne({ idCard: req.body.idCard })
      if (find2) {
        errors.idCard = 'CMND đã tồn tại';
        return res.status(400).json(errors);
      } 

      var date = new Date();
      let code = 'hv' + date.getFullYear().toString().slice(2,4) + req.body.idCard;

      var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        confirmed: true,
        phone: req.body.phone,
        idCard: req.body.idCard,
        code: code,
        courses: req.body.courseId
      });

      await
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
        });
      });

      await 
      CourseDetail.findOneAndUpdate(
        { 'courseId' : req.body.courseId },
        { 
          $push: {
            enrollStudents: {
              student: newUser._id,
              paymentMethod: 'Thanh toán tại trung tâm'
            }
          }
        }
      )

      await 
      Course.findByIdAndUpdate(
        req.body.courseId ,
        { 
          $push: {
            students: newUser._id
          }
        }
      )

      // await
      // User.findByIdAndUpdate(
      //   newUser._id ,
      //   { 
      //     $push: {
      //       courses: req.body.courseId
      //     }
      //   }
      // )
      
      const coursedetail = 
      await
      CourseDetail.findOne(
        { 'courseId' : req.body.courseId },
        { maxStudent: 1, enrollStudents: 1}
      )

      if(coursedetail.enrollStudents.length >= coursedetail.maxStudent)
        await 
        CourseDetail.findOneAndUpdate(
          { 'courseId' : req.body.courseId },
          { isFull: true }
        )

      res.json({mes:"Thêm học viên thành công"})
    } catch (err) {
      console.log(err)
    }
  }

  run();

});

// @route   POST api/users/add-joined-student
// @desc    Add student
// @access  Public
router.post('/add-joined-student', (req, res) => {

  async function run() {
    try {

      const find = 
      await
      Course.findOne(
        { _id : req.body.courseId, students: req.body.studentId }
      )

      if(find)
      {
        let errors = {};
        errors.fail = 'Học viên đã có trong khóa học'
        return res.status(400).json(errors);
      }

      const course =         
      await 
      CourseDetail.findOne(
        { 'courseId' : req.body.courseId },
        { isFull : 1 }
      )

      if(course.isFull === true)
      {
        let errors = {};
        errors.fail = 'Lớp học đã đạt số thành viên tối đa không thể thêm!'
        return res.status(400).json(errors);
      }

      await 
      CourseDetail.findOneAndUpdate(
        { 'courseId' : req.body.courseId },
        { 
          $push: {
            enrollStudents: {
              student: req.body.studentId,
              paymentMethod: 'Thanh toán tại trung tâm'
            }
          }
        }
      )

      await 
      Course.findByIdAndUpdate(
        req.body.courseId ,
        { 
          $push: {
            students: req.body.studentId
          }
        }
      )

      await
      User.findByIdAndUpdate(
        req.body.studentId ,
        { 
          $push: {
            courses: req.body.courseId
          }
        }
      )
      
      const coursedetail = 
      await
      CourseDetail.findOne(
        { 'courseId' : req.body.courseId },
        { maxStudent: 1, enrollStudents: 1}
      )

      if(coursedetail.enrollStudents.length >= coursedetail.maxStudent)
        await 
        CourseDetail.findOneAndUpdate(
          { 'courseId' : req.body.courseId },
          { isFull: true }
        )

      res.json({mes:"Thêm học viên thành công"})
    } catch (err) {
      console.log(err)
    }
  }

  run();

});

// @route   GET api/users/re-send-mail
// @desc    Gửi lại mail
// @access  Public
router.post('/re-send-mail', (req, res) => {

  async function run() {
    try {
      const user = await User.findOne({ email: req.body.email }, 'email name')

      if (!user) {
        errors.email_login = 'Không tìm thấy email này';
        return res.status(404).json(errors);
      }

      sendEmail(user.email, templates.confirm(user._id, user.name))
      .then(res.json({mes:"Đã gửi lại mail xác nhận"}))
      .catch(err => console.log(err));

    } catch (err) {
      console.log(err)
    }
  }

  run();

});

// @route   GET api/users/search-student
// @desc    Gửi lại mail
// @access  Public
router.post('/search-student', (req, res) => {

  async function run() {
    try {
      const user = await User.findOne({ email: req.body.search }, 'code idCard email name photo')

      if (!user) {
        const user2 = await User.findOne({ idCard: req.body.search }, 'code idCard email name photo')
        
        if (!user2) {
          let errors = {};
          errors.search = 'Không tìm thấy học viên này';
          return res.status(404).json(errors);
        }

        res.json(user2)

      }

      res.json(user)
      
    } catch (err) {
      console.log(err)
    }
  }

  run();

});

// @route   GET api/users/confirm/:userId
// @desc    Xác nhận mail
// @access  Public
router.post('/confirm/:userId', (req, res) => {

  async function run() {
    try {
      const user = await User.findById(req.params.userId, 'confirmed')
      if(user.confirmed === true)
        res.json({ mes: "Tài khoản mail đã được kích hoạt" })
      else{
        await User.findByIdAndUpdate(
                req.params.userId, 
                {
                  confirmed: true
                }
              )
        res.json({ mes: "Xác nhận thành công" })
      }
    } catch (err) {
      console.log(err)
    }
  }

  run();

});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find User by email
  User.findOne({ email }).then(user => {
    // Check for User
    if (!user) {
      errors.email_login = 'Không tìm thấy tài khoản này';
      return res.status(404).json(errors);
    }

    if (user.confirmed === false) {
      errors.email_login = 'Hãy xác nhận email của bạn trước khi đăng nhập';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, role: user.role, photo: user.photo, email: user.email }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          //{ expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password_login = 'Mật khẩu sai';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/login-lms
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login-lms', (req, res) => {
  const { errors, isValid } = validateLoginLMSInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const code = req.body.code;
  const password = req.body.password;

  // Find User by code
  User.findOne({ code }).then(user => {
    // Check for User
    if (!user) {
      errors.code = 'Không tìm thấy tài khoản này';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, code: user.code, name: user.name, role: user.role, photo: user.photo, email: user.email }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          //{ expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'Mật khẩu sai';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current User
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      photo: req.user.photo,
      idCard: req.user.idCard,
      role: req.user.role,
      code: req.user.code,
      teacherDegree: req.user.teacherDegree,
      teacherIntro: req.user.teacherIntro
    });
  }
);

// @route   POST api/users/edit-profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  '/edit-profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.id = req.user.id;
    if (req.body.email) profileFields.email = req.body.email;
    if (req.body.name) profileFields.name = req.body.name;
    if (req.body.phone) profileFields.phone = req.body.phone;
    if (req.body.idCard) profileFields.idCard = req.body.idCard;
    if (req.body.teacherDegree) profileFields.teacherDegree = req.body.teacherDegree;
    if (req.body.teacherIntro) profileFields.teacherIntro = req.body.teacherIntro;

    User.findByIdAndUpdate(req.user.id, profileFields, {new: true})
    .then(res.json({"mes":"Thay đổi thành công"}))
    .catch(err => console.log(err));
  }
);

// @route   post api/users/edit-avatar
// @desc    edit avatar
// @access  Private
router.post(
  '/edit-avatar',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    var fileGettingUploaded = req.files.image.path;
    cloudinary.uploader.upload(fileGettingUploaded, function(result) {
      User.updateOne(
        { _id: req.user.id },
        { $set:
           {
             photo: result.secure_url,
           }
        }
      )
      .then(res.json({"mes":"Thay đổi thành công"}))
      .catch(err => console.log(err));
    });
  }
);

// @route   POST api/users/change-password
// @desc    Change password
// @access  Private
router.post(
  '/change-password',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChangePasswordInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    const opassword = req.body.opassword;
    const password = req.body.password;

    bcrypt.compare(opassword, req.user.password).then(isMatch => {
      if (isMatch) {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            User.findByIdAndUpdate(req.user.id,{ $set: { password: hash }})
            .then(res.json({"mes":"Thay đổi password thành công"}))
            .catch(err => console.log(err));
          });
        });
      } else {
        errors.password = 'Mật khẩu hiện tại không đúng';
        return res.status(400).json(errors);
      }
    });
  }
);

// @route   GET api/users/get-users-in-course/:courseid
// @desc    get users in course
// @access  Private
router.get(
  '/get-users-in-course/:courseid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const users = {
      teachers:[],
      students:[]
    };

    async function run() {
      try {
        const course = await Course.findById(req.params.courseid)
        const teachers = await User.find({'_id': { $in: course.teachers}}, { name: 1, email: 1, photo: 1, code: 1 })
        const students = await User.find({'_id': { $in: course.students}}, { name: 1, email: 1, photo: 1, code: 1 })
        users.teachers = teachers;
        users.students = students;
        res.json(users)
      } catch (err) {
        console.log(err)
      }
    }

    run();
    
  }
);

// @route   GET api/users/:studentId
// @desc    Return student by id
// @access  Private
router.get('/:studentId', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(req.params.studentId)
 .then(student => res.json(student));
});

// @route   GET api/users/approve-list/student/:courseId
// @desc    lấy danh sách học viên ghi danh và danh sách học viên dc duyệt của 1 khóa học
// @access  Private
router.get(
  '/approve-list/student/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    async function run() {
      try {

        const coursedetail = await 
          CourseDetail.findOne(
            { 'courseId' : req.params.courseId } ,
            { enrollStudents: 1 , maxStudent: 1, minStudent: 1, isFull: 1, isNotifyMail: 1 }
          )
          .populate('enrollStudents.student', '_id name email photo code phone')
          .lean()
        
        const course = await 
          Course.findById(
            req.params.courseId  ,
            { enrollDeadline: 1, code: 1, title: 1 }
          )
          .lean()

        const result = {
          code: course.code,
          title: course.title,
          enrollDeadline: course.enrollDeadline,
          enrollStudents: coursedetail.enrollStudents,
          maxStudent: coursedetail.maxStudent,
          minStudent: coursedetail.minStudent,
          isFull: coursedetail.isFull,
          isNotifyMail: coursedetail.isNotifyMail          
        }
        res.json(result)
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   GET api/users/approve-list/teacher/:courseId
// @desc    lấy danh sách giáo viên và danh sách giáo viên của 1 khóa học
// @access  Private
router.get(
  '/approve-list/teacher/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    async function run() {
      try {
        const teacherInCourse = await     
          Course.findById(
            req.params.courseId,
            { teachers: 1 }
          )
          .populate('teachers', '_id name email photo')

        const teachers = await 
          User.find(
            { 'role' : 'teacher' } ,
            '_id name email photo'
          )
        const result = {
          teachers: teachers,
          teacherInCourse: teacherInCourse.teachers
        }
        res.json(result)
      } catch (err) {
        console.log(err)
      }
    }
    run();
  }
);

// @route   POST api/users/send-notify-mail/:courseId
// @desc    gửi mail thông báo cho tất cả học viên trong khóa ko thể mở lớp
// @access  Private
router.post(
  '/send-notify-mail/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    async function run() {
      try {
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
          sendEmail(student.email, notify.confirm(student, course, school[0]))
        })

        await
        CourseDetail.findOneAndUpdate(
          { courseId: req.params.courseId },
          { isNotifyMail:  true }
        )

        res.json({mes:"Đã gửi mail cho các học viên"})

      } catch (err) {
        console.log(err)
      }
    }
    run();
  }
);

// @route   POST api/users/rep-notify-mail/:userId/:courseId
// @desc    xác nhận mail ko thể mở lớp
// @access  Private
router.post(
  '/rep-notify-mail/:userId/:courseId',
  (req, res) => {
    async function run() {
      try {

        var course_detail = await  
        CourseDetail.findOne(
          { 'courseId' : req.params.courseId },
          {
            enrollStudents:  
            {
              $elemMatch: {
                'student': req.params.userId
              }
            }
          }
        ).lean()

        if(course_detail.enrollStudents === undefined)
        {
          let errors = {};
          errors.fail = 'Bạn đã không còn trong khóa học này';
          return res.status(400).json(errors);
        }

        await CourseDetail.updateOne(
          { 'courseId' : req.params.courseId, "enrollStudents.student": req.params.userId },
          { 
            $set: 
            { 
              "enrollStudents.$.replyMail" :  req.body.replyMail           
            } 
          }
        )

        res.json({mes:"Đã phản hồi mail thành công"})


      } catch (err) {
        console.log(err)
      }
    }
    run();
  }
);

// @route   POST api/users/get-notify-mail/:userId/:courseId
// @desc    lấy thông tin xác nhận mail ko thể mở lớp
// @access  Private
router.get(
  '/get-rep-notify-mail/:userId/:courseId',
  (req, res) => {
    async function run() {
      try {

        var course_detail = await  
        CourseDetail.findOne(
          { 'courseId' : req.params.courseId },
          {
            enrollStudents:  
            {
              $elemMatch: {
                'student': req.params.userId
              }
            }
          }
        ).lean()

        res.json(course_detail)

      } catch (err) {
        console.log(err)
      }
    }
    run();
  }
);
// @route   POST api/users/confirm-request/:userId/:courseId
// @desc    xác nhận mail ko thể mở lớp
// @access  Private
router.post(
  '/confirm-request/:courseId/:enrollStudentsId',
  (req, res) => {
    async function run() {
      try {

        var course_detail = await  
        CourseDetail.findOne(
          { 'courseId' : req.params.courseId },
          {
            enrollStudents:  
            {
              $elemMatch: {
                '_id': req.params.enrollStudentsId
              }
            }
          }
        ).lean()

        
        if(course_detail.enrollStudents[0].replyMail.chosen === 'Rời khỏi khóa học')
        {

          await
          CourseDetail.findOneAndUpdate(
            { 'courseId' : req.params.courseId },
            { 
              $pull: {
                enrollStudents: {
                  _id: req.params.enrollStudentsId
                }
              }
            }
          )
           
          await
          Course.findOneAndUpdate(
            { '_id' : req.params.courseId },
            { 
              $pull: {
                students: course_detail.enrollStudents[0].student
              }
            }
          )

          await
          User.findOneAndUpdate(
            { '_id' : course_detail.enrollStudents[0].student },
            { 
              $pull: {
                courses: req.params.courseId
              }
            }
          )

          res.json({mes:"Xác nhận thành công"})
        }else{
          await
          CourseDetail.findOneAndUpdate(
            { 'courseId' : req.params.courseId },
            { 
              $pull: {
                enrollStudents: {
                  _id: req.params.enrollStudentsId
                }
              }
            }
          )

          await
          CourseDetail.findOneAndUpdate(
            { 'courseId' : course_detail.enrollStudents[0].replyMail.changeCourseId },
            { 
              $push: {
                enrollStudents: {
                  student: course_detail.enrollStudents[0].student,
                  paymentMethod: course_detail.enrollStudents[0].paymentMethod
                }
              }
            }
          )

          await
          Course.findOneAndUpdate(
            { '_id' : req.params.courseId },
            { 
              $pull: {
                students: course_detail.enrollStudents[0].student
              }
            }
          )

          await
          Course.findOneAndUpdate(
            { '_id' : course_detail.enrollStudents[0].replyMail.changeCourseId },
            { 
              $push: {
                students: course_detail.enrollStudents[0].student
              }
            }
          )

          await
          User.findOneAndUpdate(
            { '_id' : course_detail.enrollStudents[0].student },
            { 
              $pull: {
                courses: req.params.courseId
              }
            }
          )

          await
          User.findOneAndUpdate(
            { '_id' : course_detail.enrollStudents[0].student },
            { 
              $push: {
                courses: course_detail.enrollStudents[0].replyMail.changeCourseId
              }
            }
          )
          res.json({mes:"Xác nhận thành công"})
        }

      } catch (err) {
        console.log(err)
      }
    }
    run();
  }
);

// @route   POST api/users/send-mail-reset-password/:userId
// @desc    gửi mail reset password
// @access  public
router.post(
  '/send-mail-reset-password/:userId',
  (req, res) => {
    async function run() {
      try {
  
        const user = await User.findById( req.params.userId, 'email name')

        await sendEmail(user.email, resetpassword.confirm(user._id, user.name))

        res.json({mes:"Đã gửi mail"})

      } catch (err) {
        console.log(err)
      }
    }
    run();
  }
);

// @route   POST api/users/reset-password/:userId
// @desc    reset password
// @access  public
router.post(
  '/reset-password/:userId',
  (req, res) => {
    async function run() {
      try {
        const { errors, isValid } = validateResetPasswordInput(req.body);

        // Check Validation
        if (!isValid) {
          // Return any errors with 400 status
          return res.status(400).json(errors);
        }

        const password = req.body.password;
  
        await
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            User.findByIdAndUpdate(req.params.userId,{ $set: { password: hash }})
            .then(res.json({"mes":"Đặt lại mật khẩu thành công"}))
            .catch(err => console.log(err));
          });
        });

      } catch (err) {
        console.log(err)
      }
    }
    run();
  }
);

// @route   get api/users/get-my-rating/:teacherId/:courseId
// @desc    get rating teacher
// @access  Private
router.get(
  '/get-my-rating/:teacherId/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        
        const user = await 
        User.findOne(
          { '_id' : req.params.teacherId },
          {
            teacherRating:  
            {
              $elemMatch: {
                'user': req.user.id,
                'course': req.params.courseId
              }
            }
          }
        ).lean()

        if(user.teacherRating === undefined)
          return res.json({
            star: 0,
            text: ''
          })
        else
          return res.json(user.teacherRating[0])

      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/users/rating/:teacherId/:courseId
// @desc    rate teacher
// @access  Private
router.post(
  '/rating/:teacherId/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        
        const user = await 
        User.findOne(
          { '_id' : req.params.teacherId },
          {
            teacherRating:  
            {
              $elemMatch: {
                'user': req.user.id,
                'course': req.params.courseId
              }
            }
          }
        ).lean()

        if(user.teacherRating === undefined || user.teacherRating.length === 0)
        {

          await 
          User.findByIdAndUpdate(
            req.params.teacherId,
            { 
              $push: {
                teacherRating: {
                  $each:[{
                    user: req.user.id,
                    course: req.params.courseId,
                    star1: req.body.star1,
                    star2: req.body.star2,
                    star3: req.body.star3,
                    star4: req.body.star4,
                    star5: req.body.star5,
                    star: req.body.star,
                    text: req.body.text
                  }],
                  $position: 0
                }
              }
            }
          )
        }else{
          await
          User.updateOne(
            { _id : req.params.teacherId, "teacherRating.user": req.user.id },
            { 
              $set: 
              { 
                "teacherRating.$.star1": req.body.star1,
                "teacherRating.$.star2": req.body.star2,
                "teacherRating.$.star3": req.body.star3,
                "teacherRating.$.star4": req.body.star4,
                "teacherRating.$.star5": req.body.star5,
                "teacherRating.$.star" : req.body.star,    
                "teacherRating.$.text" : req.body.text
              } 
            }
          )
        }


        res.json({ mes: 'Đánh giá thành công' })
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   POST api/users/rating2/:teacherId/:teacherRatingId
// @desc    rate teacher
// @access  Private
router.post(
  '/rating2/:teacherId/:teacherRatingId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        
        await
        User.updateOne(
          { _id : req.params.teacherId, "teacherRating._id": req.params.teacherRatingId },
          { 
            $set: 
            { 
              "teacherRating.$.star1": req.body.star1,
              "teacherRating.$.star2": req.body.star2,
              "teacherRating.$.star3": req.body.star3,
              "teacherRating.$.star4": req.body.star4,
              "teacherRating.$.star5": req.body.star5,
              "teacherRating.$.star" : req.body.star,    
              "teacherRating.$.text" : req.body.text
            } 
          }
        )
        
        res.json({ mes: 'Đánh giá 2 thành công' })
      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   get api/users/get-teacher-rating/:teacherId
// @desc    get teacher rating
// @access  Private
router.get(
  '/get-teacher-rating/:teacherId',
  (req, res) => {

    async function run() {
      try {
        
        const user = await 
        User.findOne(
          { '_id' : req.params.teacherId },
          { teacherRating: { $slice: 10 } }
        )
        .populate('teacherRating.user', '_id name email photo')
        .lean()

        return res.json(user.teacherRating)

      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   get api/users/teacher-rating/:teacherId/:teacherRatingId
// @desc    get teacher rating
// @access  Private
router.get(
  '/teacher-rating/:teacherId/:teacherRatingId',
  (req, res) => {

    async function run() {
      try {
        
        const user = await 
        User.findOne(
          { '_id' : req.params.teacherId },
          {
            teacherRating:  
            {
              $elemMatch: {
                '_id': req.params.teacherRatingId
              }
            }
          }
        )
        .lean()

        return res.json(user.teacherRating[0])

      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   get api/users/get-my-teacher-rating/:courseId
// @desc    get teacher rating
// @access  Private
router.get(
  '/get-my-teacher-rating/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        
        const user = await 
        User.findOne(
          { '_id' : req.user.id },
          { teacherRating: 1 }
        ).lean()
        
        var rate = user.teacherRating
        
        var result = []

        if(rate)
          result = await rate.filter(e => e.course.toString() === req.params.courseId);
          
        return res.json(result)

      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);

// @route   get api/users/get-my-statistic/:courseId
// @desc    get my statistic
// @access  Private
router.get(
  '/get-my-statistic/:courseId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        
        const courses = await 
          Course.findById(req.params.courseId, { minAbsent: 1, minScore: 1 })
                .lean()
    
        var point = await
          Course.findById(
            req.params.courseId,
            { pointColumns: 1 }
          )
          .populate({
            path: 'pointColumns.submit',
            match: { 'studentSubmission.userId': req.user.id },
            select: { 
              studentSubmission:  
              {
                $elemMatch: {
                  'userId': req.user.id
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

        courses.totalPoint = totalPoint.toFixed(1);

        const attendance = await
          Attendance.find(
            {
              'courseId': req.params.courseId,
              students: { $elemMatch: { 'userId': req.user.id, isPresent: false } } 
            },
            {
              date: 1
            }
          );

        courses.absent = attendance.length

        courses.student = {
          _id: req.user.id,
          photo: req.user.photo,
          code: req.user.code,
          name: req.user.name
        }

        return res.json(courses)


      } catch (err) {
        console.log(err)
      }
    }

    run();
  }
);
module.exports = router;