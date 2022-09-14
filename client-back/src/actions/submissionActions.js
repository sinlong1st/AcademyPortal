import axios from 'axios';
import config from '../config'
import { 
  CLEAR_SUCCESS, 
  CLEAR_ERRORS,
  MY_SUBMISSION_LOADING,
  GET_MY_SUBMISSION,
  MY_SUBMISSION_QUIZ_LOADING,
  GET_MY_SUBMISSION_QUIZ
} from './types';


export const setSubmissionLoading = () => {
  return {
    type: MY_SUBMISSION_LOADING
  };
};

export const getMySubmission = (exerciseId) => dispatch => {
  dispatch(setSubmissionLoading())
  axios
    .get(config.ADDRESS +`/api/exercises/${exerciseId}/get-my-submission`)
    .then(res =>{
      dispatch({
        type: GET_MY_SUBMISSION,
        payload: res.data
      })
    })
    .catch(err =>{

    });
};

export const setSubmissionQuizLoading = () => {
  return {
    type: MY_SUBMISSION_QUIZ_LOADING
  };
};

export const getMySubmissionQuiz = (courseId, quizId) => dispatch => {
  dispatch(setSubmissionQuizLoading())
  axios
    .get(config.ADDRESS +`/api/test/${courseId}/get-my-submission/${quizId}`)
    .then(res =>{
      dispatch({
        type: GET_MY_SUBMISSION_QUIZ,
        payload: res.data
      })
    })
    .catch(err =>{

    });
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
