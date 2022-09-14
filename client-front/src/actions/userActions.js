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
  GET_PAY_URL,
  CLEAR_URL,
  GET_VNPAY_RETURN,
  CLEAR_VNPAY_RETURN,
  CLEAR_ERRORS
} from './types';

import socketIOClient from "socket.io-client";
var socket = socketIOClient(config.ADDRESS);

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

// 
export const createOrder = (paymentData) => dispatch => {
  axios
    .post(config.ADDRESS +`/api/users/create_payment_url`, paymentData)
    .then(res =>{
      dispatch({
        type: GET_PAY_URL,
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

export const vnpayReturn = (query) => dispatch => {
  axios
    .get(config.ADDRESS +`/api/users/vnpay_return${query}`)
    .then(res =>{
      dispatch({
        type: GET_VNPAY_RETURN,
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

// Clear payment url
export const clearUrl = () => {
  return {
    type: CLEAR_URL
  };
};

// Clear payment url
export const clearVnpayReturn = () => {
  return {
    type: CLEAR_VNPAY_RETURN
  };
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