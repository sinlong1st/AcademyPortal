const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');

// Model
const User = require('../../models/User');

const validateEditAccountInput = require('../../validation/editAccount');

router.use(cors());

// @route   POST api/accounts/delete/:accountId
// @desc    delete account
// @access  Private
router.post(
  '/delete/:accountId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        const user = await User.findOne( { '_id': req.params.accountId } , { courses: 1 } )
        if(user.courses.length != 0)
        {
          let errors = {}
          errors.fail = 'Tài khoản này đang ở trong khóa học không thể xóa';
          return res.status(400).json(errors);
        }

        await
        User.deleteOne(
          {
            _id: req.params.accountId
          }
        )

        res.json({mes:"Xóa tài khoản thành công"})
  
      } catch (err) {
        console.log(err)
      }
    }
  
    run();

  }
);

// @route   get api/accounts/get/:accountId
// @desc    get account
// @access  Private
router.get(
  '/get/:accountId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    async function run() {
      try {
        const user = await User.findById(req.params.accountId)
                               .populate('courses', 'code title coursePhoto')

        res.json(user)
  
      } catch (err) {
        console.log(err)
      }
    }
  
    run();

  }
);

// @route   post api/accounts/edit/:accountId
// @desc    edit account
// @access  Private
router.post(
  '/edit/:accountId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    const { errors, isValid } = validateEditAccountInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    async function run() {
      try {

        const find = 
        await
        User.find(
          { $and: [ {'_id' : { $ne: req.params.accountId } }, { code: req.body.code } ] } 
        )
  
        if(find.length != 0)
        {
          let errors = {};
          errors.code = `Mã '${req.body.code}' đã được sử dụng ở tài khoản khác`
          return res.status(400).json(errors);
        }

        const profileFields = {};
        profileFields.id = req.params.accountId;
        if (req.body.email) profileFields.email = req.body.email;
        if (req.body.name) profileFields.name = req.body.name;
        if (req.body.phone) profileFields.phone = req.body.phone;
        if (req.body.idCard) profileFields.idCard = req.body.idCard;
        if (req.body.code) profileFields.code = req.body.code;
    
        User.findByIdAndUpdate(req.params.accountId, profileFields, {new: true})
        .then(res.json({"mes":"Thay đổi thành công"}))
        .catch(err => console.log(err));
  
      } catch (err) {
        console.log(err)
      }
    }
  
    run();

  }
);

// @route   post api/accounts/edit/:accountId
// @desc    edit account
// @access  Private
router.post(
  '/out-course/:userId/:courseId',
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
                _id: req.params.userId
              }
            }
          }
        )
          
        await
        Course.findOneAndUpdate(
          { '_id' : req.params.courseId },
          { 
            $pull: {
              students: req.params.userId
            }
          }
        )

        await
        User.findOneAndUpdate(
          { '_id' : req.params.userId },
          { 
            $pull: {
              courses: req.params.courseId
            }
          }
        )

        res.json({mes:"Xóa học viên khỏi khóa học thành công"})

      } catch (err) {
        console.log(err)
      }
    }
  
    run();

  }
);

module.exports = router;