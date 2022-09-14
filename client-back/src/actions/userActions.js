import axios from 'axios';
import config from '../config'; 

import { 
  GET_USERS, 
  CLEAR_USER, 
  GET_STUDENT, 
  GET_APPROVE_LIST_STUDENT, 
  GET_APPROVE_LIST_TEACHER,
  GET_SUCCESS, 
  GET_ERRORS, 
  CLEAR_SUCCESS, 
  USERS_LOADING,
  CLEAR_ERRORS,
  SEARCH_STUDENT,
  CLEAR_SEARCH,
  GET_REP_MAIL_INFO
} from './types';

import socketIOClient from "socket.io-client";
var socket = socketIOClient(config.ADDRESS);

// Create admin, giám đốc account
export const start = () => dispatch => {
  axios
    .post(config.ADDRESS +'/api/users/start')
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get a list of users
export const getUsers = (courseid) => dispatch => {
  dispatch(setUsersLoading());
  axios
    .get(config.ADDRESS +'/api/users/get-users-in-course/' + courseid)
    .then(res =>
      dispatch({
        type: GET_USERS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_USERS,
        payload: {}
      })
    );
};

// Get student info
export const getStudent = (studentId) => dispatch => {
  dispatch(setUsersLoading());
  axios
    .get(config.ADDRESS +'/api/users/' + studentId)
    .then(res =>
      dispatch({
        type: GET_STUDENT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_STUDENT,
        payload: {}
      })
    );
};

// lấy danh sách giáo viên và danh sách giáo viên dc duyệt của 1 khóa học
export const getApproveListTeacher = (courseId) => dispatch => {
  dispatch(setUsersLoading());
  axios
    .get(config.ADDRESS +'/api/users/approve-list/teacher/' + courseId)
    .then(res =>{
      dispatch({
        type: GET_APPROVE_LIST_TEACHER,
        payload: res.data
      })
    })
    .catch(err =>{
      dispatch({
        type: GET_APPROVE_LIST_TEACHER,
        payload: {}
      })
    });
};
// lấy danh sách học viên ghi danh và danh sách giáo viên dc duyệt của 1 khóa học
export const getApproveListStudent = (courseId) => dispatch => {
  dispatch(setUsersLoading());
  socket.emit("student_approve_list", courseId);
  socket.on("get_student_approve_list", 
    res =>{
      dispatch({
        type: GET_APPROVE_LIST_STUDENT,
        payload: res
      })
    }
  );
};
// Approve Student to Course
export const approveStudent = (courseId, studentId) => dispatch => {
  axios
    .post(config.ADDRESS +`/api/courses/approve/student/${courseId}/${studentId}`)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
      dispatch(getApproveListStudent(courseId))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Approve teacher to Course
export const approveTeacher = (courseId, teacherId) => dispatch => {
  axios
    .post(config.ADDRESS +`/api/courses/approve/teacher/${courseId}/${teacherId}`)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
      dispatch(getApproveListTeacher(courseId))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// delete teacher from Course
export const deleteTeacher = (courseId, teacherId) => dispatch => {
  axios
    .post(config.ADDRESS +`/api/courses/delete/teacher/${courseId}/${teacherId}`)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
      dispatch(getApproveListTeacher(courseId))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// add student
export const addStudent = userData => dispatch => {
  axios
    .post(config.ADDRESS +'/api/users/add-student', userData)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// add student
export const searchStudent = userData => dispatch => {
  dispatch(setUsersLoading());
  axios
    .post(config.ADDRESS +'/api/users/search-student', userData)
    .then(res =>{
      dispatch({
        type: SEARCH_STUDENT,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// add student
export const addJoinedStudent = userData => dispatch => {
  axios
    .post(config.ADDRESS +'/api/users/add-joined-student', userData)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// gửi mail thông báo cho học viên
export const notifyMail = (courseId) => dispatch => {
  axios
    .post(config.ADDRESS +'/api/users/send-notify-mail/' + courseId)
    .then(res =>
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// duyệt yêu cầu học viên
export const confirmRequest = (courseId, enrollStudentsId) => dispatch => {
  axios
    .post(config.ADDRESS +`/api/users/confirm-request/${courseId}/${enrollStudentsId}`)
    .then(res =>
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};


export const sendMailResetPassword = (userId) => dispatch => {
  axios
    .post(config.ADDRESS +`/api/users/send-mail-reset-password/${userId}`)
    .then(res =>
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const resetPassword = (userId, passwordData) => dispatch => {
  axios
    .post(config.ADDRESS +`/api/users/reset-password/${userId}`, passwordData)
    .then(res =>
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const repNotifyMail = (userId, courseId, repData) => dispatch => {
  axios
    .post(config.ADDRESS +`/api/users/rep-notify-mail/${userId}/${courseId}`, repData)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const getrepNotifyMail = (userId, courseId) => dispatch => {
  dispatch(setUsersLoading());
  axios
    .get(config.ADDRESS +`/api/users/get-rep-notify-mail/${userId}/${courseId}`)
    .then(res =>{
      dispatch({
        type: GET_REP_MAIL_INFO,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setUsersLoading = () => {
  return {
    type: USERS_LOADING
  };
};

// Clear a list of users
export const clearUsers = () => {
  return {
    type: CLEAR_USER
  };
};

// Clear a list of users
export const clearSearch = () => {
  return {
    type: CLEAR_SEARCH
  };
};

export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};