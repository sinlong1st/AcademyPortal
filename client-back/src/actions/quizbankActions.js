import axios from 'axios';
import config from '../config';
import { SubmissionError } from 'redux-form';

import { QUIZ_BANK_LOADING, GET_QUIZBANK, GET_CATEGORY, GET_ERRORS, CLEAR_ERRORS, GET_SUCCESS, CLEAR_SUCCESS } from './types';

import socketIOClient from "socket.io-client";
var socket = socketIOClient(config.ADDRESS);

export const setQuizBankLoading = () => {
  return {
    type: QUIZ_BANK_LOADING
  };
};

// add category
export const addCategory = (categoryData) => dispatch => {
  axios
    .post(config.ADDRESS + '/api/quizbank/add-category', categoryData)
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

// editCatName
export const editCatName = (catId, categoryData) => dispatch => {
  axios
    .post(config.ADDRESS + '/api/quizbank/edit-category-name/' + catId, categoryData)
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

export const addMoreQuiz = (catId, quizData) => dispatch => {
  return axios
    .post(config.ADDRESS + '/api/quizbank/add-more-quiz/' + catId, quizData)
    .then(res => {
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>{
      throw new SubmissionError(err.response.data);
    });
};

export const addMoreQuizCSV = (catId, quizData) => dispatch => {
  return axios
    .post(config.ADDRESS + '/api/quizbank/add-more-quiz-csv/' + catId, quizData)
    .then(res => {
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>{
      console.log(err.response.data);
    });
};

export const editQuiz = (catId, quizData) => dispatch => {
  return axios
    .post(config.ADDRESS + '/api/quizbank/edit-quiz/' + catId, quizData)
    .then(res => {
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>{
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    });
};

export const deleteQuiz = (catId, listquizId) => dispatch => {
  return axios
    .post(`${config.ADDRESS}/api/quizbank/delete-quiz/${catId}/${listquizId}`)
    .then(res => {
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
    })
    .catch(err =>{
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    });
};

// get quiz bank
export const getQuizBank = () => dispatch => {
  dispatch(setQuizBankLoading());  
  socket.emit("quizbank");
  socket.on("get_quizbank", 
    res =>{
      dispatch({
        type: GET_QUIZBANK,
        payload: res
      })
    }
  ); 
};

// Get detail test quiz by id
export const getCategory = (categoryId) => dispatch => {
  dispatch(setQuizBankLoading());
  socket.emit("category", categoryId);
  socket.on("get_category", 
    res =>{
      dispatch({
        type: GET_CATEGORY,
        payload: res
      })
    }
  ); 
}

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
