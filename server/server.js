const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const socketIO = require("socket.io");

require('dotenv').config();

const users = require('./routes/api/users');

const school = require('./routes/api/school');

const courses = require('./routes/api/courses');

const exercises = require('./routes/api/exercises');

const test = require('./routes/api/test');

const attendance = require('./routes/api/attendance');

const schedule = require('./routes/api/schedule');

const lesson = require('./routes/api/lesson');

const accounts = require('./routes/api/accounts');

const infrastructure = require('./routes/api/infrastructure');

const quizbank = require('./routes/api/quizbank');

const app = express();

//Bodyparser Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended : false
  })
)

//DB config
const db = require('./config/keys').mongoURI;

//Connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(()=> console.log('Mongodb connected ...'))
  .catch(err => console.log(err));
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// users Route
app.use('/api/users', users)

// courses Route
app.use('/api/courses', courses)

// school Route
app.use('/api/school', school)

// exercises Route
app.use('/api/exercises', exercises)

// attendance Route
app.use('/api/attendance', attendance)

// schedule Route
app.use('/api/schedule', schedule)

// exercises Route
app.use('/api/test', test);

// lesson Route
app.use('/api/lesson', lesson);

// accounts Route
app.use('/api/accounts', accounts);

// infrastructure Route
app.use('/api/infrastructure', infrastructure);

// quizbank Route
app.use('/api/quizbank', quizbank);

const port = process.env.PORT || 5000;

const http = require("http");
const server = http.createServer(app);
const io = socketIO(server);
const socketEvents = require('./socketEvents');

socketEvents(io);


server.listen(port, ()=> console.log(`Server starting on ${port}`));