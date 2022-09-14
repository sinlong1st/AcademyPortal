import axios from 'axios';
import config from '../config';

import { 
  GET_SUCCESS, 
  GET_ERRORS, 
  GET_ATTENDANCE, 
  CLEAR_ATTENDANCE, 
  GET_STUDENT_ABSENT_LIST, 
  ATTENDANCE_LOADING,
  GET_TODAY_ATTENDANCE
} from './types';

// Add Attendance
export const addAttendance= (newAttendance) => dispatch => {
  axios
    .post(config.ADDRESS + '/api/attendance/add-attendance', newAttendance)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Điểm danh thành công',
      messages: ''}
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Edit Attendance
export const editAttendance= (editAttendance) => dispatch => {
  axios
    .post(config.ADDRESS + '/api/attendance/edit-attendance', editAttendance)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Điểm danh thành công'}
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const clearAttendance = () => {
  return {
    type: CLEAR_ATTENDANCE
  };
};

// Get Attendance
export const getAttendance = (courseId) => dispatch => {
  dispatch(setAttendacneLoading());
  axios
    .get(config.ADDRESS + '/api/attendance/get-attendance/' + courseId)
    .then(res =>{
      dispatch({
        type: GET_ATTENDANCE,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ATTENDANCE,
        payload: {}
      })
    );
};

// Get Attendance
export const getTodayAttendance = (courseId, date) => dispatch => {
  dispatch(setAttendacneLoading());
  axios
    .post(config.ADDRESS +'/api/attendance/get-today-attendance/' + courseId, date)
    .then(res =>{
      dispatch({
        type: GET_TODAY_ATTENDANCE,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_TODAY_ATTENDANCE,
        payload: {}
      })
    );
};

export const setAttendacneLoading = () => {
  return {
    type: ATTENDANCE_LOADING
  };
};

// get a student absent list in a course by courseId and that studentId
export const getStudentAbsent = (courseId, studentId) => dispatch => {
  dispatch(setAttendacneLoading());
  axios
    .get(config.ADDRESS +`/api/attendance/get-student-absent/${courseId}/${studentId}`)
    .then(res =>{
      dispatch({
        type: GET_STUDENT_ABSENT_LIST,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_STUDENT_ABSENT_LIST,
        payload: {}
      })
    );
};
