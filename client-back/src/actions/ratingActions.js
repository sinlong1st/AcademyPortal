import axios from 'axios';
import config from '../config';

import { RATING_LOADING, GET_MY_RATING, GET_MY_TEACHER_RATING, GET_ERRORS, CLEAR_ERRORS, GET_SUCCESS, CLEAR_SUCCESS, GET_TEACHERS_RATING, 
  GET_TEACHER_RATING,  
  TEACHER_RATING_LOADING
} from './types';

import socketIOClient from "socket.io-client";
var socket = socketIOClient(config.ADDRESS);

export const setRatingLoading = () => {
  return {
    type: RATING_LOADING
  };
};

// Get Profle
export const getMyRating = (teacherId, courseId) => dispatch => {
  dispatch(setRatingLoading());
  axios
    .get(config.ADDRESS +`/api/users/get-my-rating/${teacherId}/${courseId}`)
    .then(res =>
      dispatch({
        type: GET_MY_RATING,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_MY_RATING,
        payload: {}
      })
    );
};

// Get Profle
export const getMyTeacherRating = (courseId) => dispatch => {
  dispatch(setRatingLoading());
  axios
    .get(config.ADDRESS +`/api/users/get-my-teacher-rating/${courseId}`)
    .then(res =>
      dispatch({
        type: GET_MY_TEACHER_RATING,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_MY_TEACHER_RATING,
        payload: {}
      })
    );
};

// rating
export const ratingTeacher = (ratingData, teacherId, courseId) => dispatch => {
  axios
    .post(config.ADDRESS + `/api/users/rating/${teacherId}/${courseId}`, ratingData)
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

// rating
export const ratingTeacher2 = (ratingData, teacherId, teacherRatingId) => dispatch => {
  axios
    .post(config.ADDRESS + `/api/users/rating2/${teacherId}/${teacherRatingId}`, ratingData)
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

// Get Profle
export const getTeachersRating = (courseId) => dispatch => {
  dispatch(setRatingLoading());
  socket.emit("teachers_rating", courseId);
  socket.on("get_teachers_rating", 
    res =>{
      dispatch({
        type: GET_TEACHERS_RATING,
        payload: res
      })
    }
  );
};

export const setTeacherRatingLoading = () => {
  return {
    type: TEACHER_RATING_LOADING
  };
};

// Get Profle
export const getTeacherRating = (teacherId, teacherRatingId) => dispatch => {
  dispatch(setTeacherRatingLoading());
  axios
    .get(config.ADDRESS + `/api/users/teacher-rating/${teacherId}/${teacherRatingId}`)
    .then(res =>{
      dispatch({
        type: GET_TEACHER_RATING,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_TEACHER_RATING,
        payload: err.response.data
      })
    );
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS
  };
};
