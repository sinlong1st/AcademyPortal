import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form'
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReducer';
import successReducer from './successReducer';
import courseReducer from './courseReducer';
import usersReducer from './usersReducer';
import exerciseReducer from './exerciseReducer';
import commentReducer from './commentReducer';
import attendanceReducer from './attendanceReducer';
import scheduleReducer from './scheduleReducer';
import submissionReducer from './submissionReducer';
import testQuizReducer from './testQuizReducer';
import pointReducer from './pointReducer';
import lessonReducer from './lessonReducer';
import schoolReducer from './schoolReducer';
import ratingReducer from './ratingReducer';
import infrastructureReducer from './infrastructureReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  success: successReducer,
  courses: courseReducer,
  users: usersReducer,
  exercises: exerciseReducer,
  comments: commentReducer,
  form: formReducer,
  attendance: attendanceReducer,
  schedule: scheduleReducer,
  testQuiz: testQuizReducer,
  submission: submissionReducer,
  point: pointReducer,
  lesson: lessonReducer,
  school: schoolReducer,
  rating: ratingReducer,
  infrastructure: infrastructureReducer,
});

