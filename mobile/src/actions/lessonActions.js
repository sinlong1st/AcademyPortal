import axios from 'axios';
import config from '../config';

import { 
  GET_SUCCESS, 
  GET_ERRORS, 
  CLEAR_SUCCESS, 
  CLEAR_ERRORS,
  GET_LESSON_LIST,
  LESSON_LOADING,
  GET_LESSON,
  GET_LESSON_TOTAL_LIST,
  GET_LESSON_IN_COURSE
} from './types';

// Add Lesson List
export const addLessonList= (newLessonList) => dispatch => {
  axios
    .post(`${config.ADDRESS}/api/lesson/add-lesson-list`, newLessonList)
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

// get Lesson List
export const getLessonList = () => dispatch => {
  dispatch(setLessonLoading());
  axios
    .get(`${config.ADDRESS}/api/lesson/get-lesson-list`)
    .then(res =>{
      dispatch({
        type: GET_LESSON_LIST,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_LESSON_LIST,
        payload: {}
      })
    );
};

// get Lesson in a List
export const getLesson = (listId, lessonId) => dispatch => {
  dispatch(setLessonLoading());
  axios
    .get(`${config.ADDRESS}/api/lesson/get-lesson-in-list/${listId}/${lessonId}`)
    .then(res =>{
      dispatch({
        type: GET_LESSON,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_LESSON,
        payload: {}
      })
    );
};

// Edit Lesson
export const editLesson= (listId, lessonId, lessonData) => dispatch => {
  axios
  .post(`${config.ADDRESS}/api/lesson/edit-lesson/${listId}/${lessonId}`, lessonData)
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

// lấy danh sách bài học có số buổi học tùy chọn
export const getListLessonTotal= (lessonTotal) => dispatch => {
  dispatch(setLessonLoading());
  axios
  .get(`${config.ADDRESS}/api/lesson/get-list-lessonTotal/${lessonTotal}`)
    .then(res =>{
      dispatch({
        type: GET_LESSON_TOTAL_LIST,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_LESSON_TOTAL_LIST,
        payload: {}
      })
    );
};

// lấy 1 bài học trong khóa học
export const getLessonIncourse= (courseId, lessonId) => dispatch => {
  dispatch(setLessonLoading());
  axios
  .get(`${config.ADDRESS}/api/lesson/get-lesson-in-course/${courseId}/${lessonId}`)
    .then(res =>{
      dispatch({
        type: GET_LESSON_IN_COURSE,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_LESSON_IN_COURSE,
        payload: {}
      })
    );
};

export const addQuizLesson = (courseId, lessonId, quizId, deadlineData) => dispatch => {
  axios
    .post(`${config.ADDRESS}/api/lesson/add-quiz-event/${courseId}/${lessonId}/${quizId}`, deadlineData)
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

export const setLessonLoading = () => {
  return {
    type: LESSON_LOADING
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