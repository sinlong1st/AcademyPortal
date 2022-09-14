import axios from 'axios';

import { GET_USERS, USERS_LOADING, GET_APPROVE_LIST_STUDENT, GET_SUCCESS, GET_ERRORS, CLEAR_SUCCESS, GET_STUDENT, GET_APPROVE_LIST_TEACHER } from './types';
import config from '../config';

// Get a list of users
export const getUsers = (courseid) => dispatch => {
  dispatch(setUsersLoading());
  axios
    .get(config.ADDRESS + '/api/users/get-users-in-course/' + courseid)
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

// lấy danh sách giáo viên và danh sách giáo viên dc duyệt của 1 khóa học
export const getApproveListTeacher = (courseId) => dispatch => {
  dispatch(setUsersLoading());
  axios
    .get(config.ADDRESS + '/api/users/approve-list/teacher/' + courseId)
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

// lấy danh sách học viên ghi danh và danh sách học viên dc duyệt của 1 khóa học
export const getApproveList = (courseId) => dispatch => {
  dispatch(setUsersLoading());
  axios
    .get(config.ADDRESS + '/api/users/approve-list/student/' + courseId)
    .then(res =>
      dispatch({
        type: GET_APPROVE_LIST_STUDENT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_APPROVE_LIST_STUDENT,
        payload: {}
      })
    );
};

// Approve Student to Course
export const approveStudent = (courseId, studentId) => dispatch => {
  axios
    .post(`${config.ADDRESS}/api/courses/approve/student/${courseId}/${studentId}`)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
      dispatch(getApproveList(courseId))
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
    .post(`${config.ADDRESS}/api/courses/approve/teacher/${courseId}/${teacherId}`)
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

// Get student info
export const getStudent = (studentId) => dispatch => {
  dispatch(setUsersLoading());
  axios
    .get(config.ADDRESS + '/api/users/' + studentId)
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

export const setUsersLoading = () => {
  return {
    type: USERS_LOADING
  };
};

export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};