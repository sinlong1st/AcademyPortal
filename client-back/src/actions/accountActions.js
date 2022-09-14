import axios from 'axios';
import config from '../config';

import { 
  GET_ACCOUNTS,
  ACCOUNTS_LOADING,
  GET_SUCCESS,
  GET_ERRORS,
  CLEAR_ERRORS,
  CLEAR_SUCCESS,
  GET_ACCOUNT,
  GET_STUDENT_ACCOUNTS
} from './types';

import socketIOClient from "socket.io-client";
var socket = socketIOClient(config.ADDRESS);

// Get Attendance
export const getAccounts = () => dispatch => {
  dispatch(setAccountsLoading());
  socket.emit("accounts");
  socket.on("get_accounts", 
    res =>{
      dispatch({
        type: GET_ACCOUNTS,
        payload: res
      })
    }
  );
};

// Get Student accounts
export const getStudentAccounts = () => dispatch => {
  dispatch(setAccountsLoading());
  socket.emit("student_accounts");
  socket.on("get_student_accounts", 
    res =>{
      dispatch({
        type: GET_STUDENT_ACCOUNTS,
        payload: res
      })
    }
  );
};

// Get Attendance
export const deleteAccount = (accountId) => dispatch => {
  axios
    .post(config.ADDRESS + '/api/accounts/delete/' + accountId)
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

// Get Account
export const getAccount = (accountId) => dispatch => {
  axios
    .get(config.ADDRESS + '/api/accounts/get/' + accountId)
    .then(res =>{
      dispatch({
        type: GET_ACCOUNT,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_ACCOUNT,
        payload: {}
      })
    );
};

// Edit Account
export const editAccount = (accountId, accountData) => dispatch => {
  axios
    .post(config.ADDRESS + '/api/accounts/edit/' + accountId, accountData)
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

// out course
export const outCourse = (userId, courseId) => dispatch => {
  axios
    .post(config.ADDRESS + `/api/accounts/out-course/${userId}/${courseId}`)
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

export const setAccountsLoading = () => {
  return {
    type: ACCOUNTS_LOADING
  };
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