const express = require('express');
const router = express.Router();
const cors = require('cors');
const passport = require('passport');
require('dotenv').config()


const validateAddInfrastructureInput = require('../../validation/addInfrastructure');

// Model
const Infrastructure = require('../../models/Infrastructure');

router.use(cors());

// @route   POST api/infrastructure/add
// @desc    add infrastructure
// @access  Private
router.post('/add', passport.authenticate('jwt', {session: false}),(req, res) => {
    const { errors, isValid } = validateAddInfrastructureInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    async function run() {
        try {
            const newInfrastructure = new Infrastructure({
                name: req.body.name,
                address: req.body.address,
                city: req.body.city,
                phone: req.body.phone,
                email: req.body.email,
                description: req.body.description,
                mapPosition: req.body.mapPosition,
                images: req.body.images
            });
            newInfrastructure
                .save()
                .then(res.json({ mes: 'Thêm cơ sở thành công' }))
                .catch(err => console.log(err));
        } catch (err) {
            console.log(err);
        }
    }
    run();
});

// @route   POST api/infrastructure/delete/:infrastructureId
// @desc    delete infrastructure
// @access  Private
router.post(
  '/delete/:infrastructureId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    async function run() {
      try {

        await
        Infrastructure.deleteOne(
          {
            _id: req.params.infrastructureId
          }
        )

        res.json({mes:"Xóa cơ sở thành công"})
  
      } catch (err) {
        console.log(err)
      }
    }
  
    run();

  }
);

// @route   POST api/infrastructure/edit/:infrastructureId
// @desc    edit infrastructure
// @access  Private
router.post('/edit/:infrastructureId', passport.authenticate('jwt', {session: false}),(req, res) => {
    async function run() {
      try {
        const { errors, isValid } = validateAddInfrastructureInput(req.body);
        
        if (!isValid) {
          return res.status(400).json(errors);
        }

        await 
        Infrastructure.updateOne(
          { _id: req.params.infrastructureId },
          {
            $set: {
              name: req.body.name,
              address: req.body.address,
              city: req.body.city,
              phone: req.body.phone,
              email: req.body.email,
              description: req.body.description,
              mapPosition: req.body.mapPosition,
              images: req.body.images
            }
          }
        )

        res.json({mes: 'Chỉnh sửa cơ sở thành công'})
  
      } catch (err) {
        console.log(err)
      }
    }
    run();
});

// @route   get api/infrastructure
// @desc    edit info
// @access  public
router.get('/', (req, res) => {

  async function run() {
    try {

      const infrastructure = await Infrastructure.find();
      res.json(infrastructure);

    } catch (err) {
      console.log(err)
    }
  }
  run();
});

// @route   get api/infrastructure/:infrastructureId
// @desc    edit info
// @access  public
router.get('/:infrastructureId', (req, res) => {

  async function run() {
    try {

      const infrastructure = await Infrastructure.findById(req.params.infrastructureId);
      res.json(infrastructure);

    } catch (err) {
      console.log(err)
    }
  }
  run();
});
module.exports = router;