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
  GET_LESSON_IN_COURSE,
  GET_LESSON_LIST_INFO
} from './types';

import socketIOClient from "socket.io-client";
var socket = socketIOClient(config.ADDRESS);

// Add Lesson List
export const addLessonList= (newLessonList) => dispatch => {
  axios
    .post(config.ADDRESS +'/api/lesson/add-lesson-list', newLessonList)
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
  socket.emit("lesson_list");
  socket.on("get_lesson_list", 
    res =>{
      dispatch({
        type: GET_LESSON_LIST,
        payload: res
      })
    }
  );
};

// get List
export const getListInfo = (listId) => dispatch => {
  dispatch(setLessonLoading());
  socket.emit("list", listId);
  socket.on("get_list", 
    res =>{
      dispatch({
        type: GET_LESSON_LIST_INFO,
        payload: res
      })
    }
  );
};

// Edit Lesson
export const editTitle = (listId, lessonData) => dispatch => {
  axios
  .post(config.ADDRESS +`/api/lesson/edit-lesson-list-name/${listId}`, lessonData)
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

// Edit Lesson
export const editCertification = (listId, lessonData) => dispatch => {
  axios
  .post(config.ADDRESS +`/api/lesson/edit-lesson-list-certification/${listId}`, lessonData)
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

// get Lesson in a List
export const getLesson = (listId, lessonId) => dispatch => {
  dispatch(setLessonLoading());
  axios
    .get(config.ADDRESS +`/api/lesson/get-lesson-in-list/${listId}/${lessonId}`)
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
  .post(config.ADDRESS +`/api/lesson/edit-lesson/${listId}/${lessonId}`, lessonData)
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
  .get(config.ADDRESS +`/api/lesson/get-list-lessonTotal/${lessonTotal}`)
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
  const dataId = {
    courseId,
    lessonId
  }
  socket.emit("lesson_in_course", dataId);
  socket.on("get_lesson_in_course", 
    res =>{
      dispatch({
        type: GET_LESSON_IN_COURSE,
        payload: res
      })
    }
  );
};

export const addQuizLesson = (courseId, lessonId, quizId, deadlineData) => dispatch => {
  axios
    .post(config.ADDRESS +`/api/lesson/add-quiz-event/${courseId}/${lessonId}/${quizId}`, deadlineData)
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