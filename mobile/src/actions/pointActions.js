import axios from 'axios';
import config from '../config';

import { 
  POINT_LOADING,
  GET_POINT_COLUMNS,
  GET_SUCCESS,
  GET_ERRORS,
  GET_STUDENT_POINT
} from './types';


export const setPointLoading = () => {
  return {
    type: POINT_LOADING
  };
};

// get point columns of a course
export const getPointColumns = (courseId) => dispatch => {
  dispatch(setPointLoading())
  axios
    .get(`${config.ADDRESS}/api/courses/get-point-columns/${courseId}`)
    .then(res =>
      dispatch({
        type: GET_POINT_COLUMNS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POINT_COLUMNS,
        payload: {}
      })
    );
};

// gán pointcolumn loại exercise
export const setPointColumnsExercise = ( courseId, pointColumnsId, exerciseId ) => dispatch => {
  axios
    .get(`${config.ADDRESS}/api/courses/set-point-colums-exercise/${courseId}/${pointColumnsId}/${exerciseId}`)
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

// gán pointcolumn loại quiz
export const setPointColumnsQuiz = ( courseId, pointColumnsId, quizId ) => dispatch => {
  axios
    .get(`${config.ADDRESS}/api/courses/set-point-colums-quiz/${courseId}/${pointColumnsId}/${quizId}`)
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

// get point columns of a course
export const getPointColumnsStudent = (courseId, studentId) => dispatch => {
  dispatch(setPointLoading())
  axios
    .get(`${config.ADDRESS}/api/courses/get-point-columns-student/${courseId}/${studentId}`)
    .then(res =>
      dispatch({
        type: GET_STUDENT_POINT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_STUDENT_POINT,
        payload: {}
      })
    );
};