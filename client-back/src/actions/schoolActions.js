import axios from 'axios';
import config from '../config';

import { GET_SUCCESS, GET_ERRORS, CLEAR_ERRORS, CLEAR_SUCCESS, GET_SCHOOL, SCHOOL_LOADING } from './types';

import socketIOClient from "socket.io-client";
var socket = socketIOClient(config.ADDRESS);

// edit school
export const editSchool= (schoolData) => dispatch => {
  axios
    .post(config.ADDRESS +'/api/school/edit', schoolData)
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

export const setSchoolLoading = () => {
  return {
    type: SCHOOL_LOADING
  };
};

// get school
export const getSchool = () => dispatch => {
  dispatch(setSchoolLoading());  
  socket.emit("school");
  socket.on("get_school", 
    res =>{
      dispatch({
        type: GET_SCHOOL,
        payload: res
      })
    }
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