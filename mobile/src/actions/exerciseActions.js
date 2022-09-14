import axios from 'axios';
import config from '../config';

import { 
  GET_EXERCISE_LIST, 
  CLEAR_SUCCESS, 
  CLEAR_ERRORS, 
  EXERCISE_LOADING,
  GET_COMMENT,
  COMMENT_LOADING,
  GET_ERRORS,
  GET_SUCCESS,
  GET_EXERPOINT
} from './types';

export const getExercisePoint = (id) => dispatch => {
  dispatch(setExercisesLoading());
  axios
    .get(config.ADDRESS +`/api/exercises/exercisePointOP/${id}`)
    .then(res => {
      dispatch({
        type: GET_EXERPOINT,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_EXERPOINT,
        payload: {}
      }
    ))
}

// Add Point
export const addPoint= (newPoint) => dispatch => {
  axios
    .post(config.ADDRESS +'/api/exercises/add-point', newPoint)
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

export const getExerciseList = (courseId) => dispatch => {
  dispatch(setExercisesLoading());
  axios
    .get(`${config.ADDRESS}/api/exercises/${courseId}`)
    .then(res =>
      dispatch({
        type: GET_EXERCISE_LIST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_EXERCISE_LIST,
        payload: {}
      })
    );
};

// get comment
export const getComments = (exerciseId) => dispatch => {
  dispatch(setCommentsLoading());
  axios
    .get(`${config.ADDRESS}/api/exercises/get-comments/${exerciseId}`)
    .then(res =>
      dispatch({
        type: GET_COMMENT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_COMMENT,
        payload: {}
      })
    );
};

export const setCommentsLoading = () => {
  return {
    type: COMMENT_LOADING
  };
};

// Add Comment
export const addComment = (commentData, exerciseId) => dispatch => {
  axios
    .post(`${config.ADDRESS}/api/exercises/comment/${exerciseId}`, commentData)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: res.data
      })
      dispatch(getComments(exerciseId))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
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

export const setExercisesLoading = () => {
  return {
    type: EXERCISE_LOADING
  };
};