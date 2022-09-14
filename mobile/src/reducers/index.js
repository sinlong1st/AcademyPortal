import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import successReducer from './successReducer';
import profileReducer from './profileReducer';
import courseReducer from './courseReducer';
import exerciseReducer from './exerciseReducer';
import usersReducer from './usersReducer';
import commentReducer from './commentReducer';
import attendanceReducer from './attendanceReducer';
import pointReducer from './pointReducer';
import scheduleReducer from './scheduleReducer';
import lessonReducer from './lessonReducer';
import schoolReducer from './schoolReducer';
import mysubmissionReducer from './mysubmissionReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  success: successReducer,
  profile: profileReducer,
  courses: courseReducer,
  exercises: exerciseReducer,
  users: usersReducer,
  comments: commentReducer,
  attendance: attendanceReducer,
  point: pointReducer,
  schedule: scheduleReducer,
  lesson: lessonReducer,
  school: schoolReducer,
  mysubmission: mysubmissionReducer
});
