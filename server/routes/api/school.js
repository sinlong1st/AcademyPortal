const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
require('dotenv').config()


const validateEditSchoolInput = require('../../validation/editSchool');

// Model
const School = require('../../models/School');

router.use(cors());


// @route   POST api/school/edit
// @desc    edit info
// @access  Private
router.post('/edit', passport.authenticate('jwt', {session: false}),(req, res) => {
    const { errors, isValid } = validateEditSchoolInput(req.body);
    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    async function run() {
      try {

        const school = await School.find();

        if(school.length !== 0)
        {
          School.findByIdAndUpdate(
            school[0]._id,
            {
              name: req.body.name,
              shortIntro: req.body.shortIntro,
              address: req.body.address,
              phone: req.body.phone,
              email: req.body.email,
              facebook: req.body.facebook,
              video: req.body.video,
              intro: req.body.intro
            }
          )
          .then(res.json({mes: 'Chỉnh sửa thông tin thành công'}))
          .catch(err => console.log(err));

        }else{
          const newSchool = new School({
            name: req.body.name,
            shortIntro: req.body.shortIntro,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email,
            facebook: req.body.facebook,
            video: req.body.video,
            intro: req.body.intro
          });

          newSchool
          .save()
          .then(res.json({mes: 'Chỉnh sửa thông tin thành công'}))
          .catch(err => console.log(err));
        }


      } catch (err) {
        console.log(err)
      }
    }
    run();

});

// @route   get api/school/get
// @desc    edit info
// @access  public
router.get('/get', (req, res) => {

  async function run() {
    try {

      const school = await School.find();
      res.json(school[0])

    } catch (err) {
      console.log(err)
    }
  }
  run();

});
module.exports = router;