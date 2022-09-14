import axios from 'axios';
import config from '../config';

import { 
  GET_ERRORS, 
  CLEAR_ERRORS, 
  GET_SUCCESS, 
  CLEAR_SUCCESS, 
  GET_CURRENT_COURSES, 
  GET_STUDENT_COURSES , 
  GET_ALL_COURSES,
  GET_COURSE_INFO, 
  GET_MANAGE_COURSES, 
  ALLCOURSE_LOADING,
  GET_ACTIVE_COURSES,
  GET_GUEST_COURSE_INFO,
  COURSE_INFO_LOADING
} from './types';

import socketIOClient from "socket.io-client";
var socket = socketIOClient(config.ADDRESS);

// Add Course
export const addCourse = (courseData, fileData) => dispatch => {
  axios
    .post(config.ADDRESS +'/api/courses/add-course', courseData)
    .then(res =>{

      if(fileData !== null)
      {
        let fd = new FormData();
        fd.append('image', fileData, fileData.name)
        axios.post(config.ADDRESS +'/api/courses/add-course-avatar/' + res.data.courseId, fd)
        .then(data  => {
          dispatch({
            type: GET_SUCCESS,
            payload: {data: 'Thêm khóa học thành công'}
          })
        });
      }
      else
      {
        dispatch({
          type: GET_SUCCESS,
          payload: {data: 'Thêm khóa học thành công'}
        })
      }

    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Edit Course
export const editCourse = (courseId, courseData, fileData) => dispatch => {
  axios
    .post(config.ADDRESS +`/api/courses/edit-course/${courseId}`, courseData)
    .then(res =>{

      if(fileData !== null)
      {
        let fd = new FormData();
        fd.append('image', fileData, fileData.name)
        axios.post(config.ADDRESS +`/api/courses/add-course-avatar/${courseId}`, fd)
        .then(data  => {
          dispatch({
            type: GET_SUCCESS,
            payload: {data: 'Chỉnh sửa khóa học thành công'}
          })
        });
      }
      else
      {
        dispatch({
          type: GET_SUCCESS,
          payload: {data: 'Chỉnh sửa khóa học thành công'}
        })
      }

    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Enroll Course
export const enrollCourse = (courseId, paymentData) => dispatch => {
  axios
    .post(config.ADDRESS +'/api/courses/enroll-course/' + courseId, paymentData)
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

// Unenroll Course
export const unenrollCourse = (courseId) => dispatch => {
  axios
    .post(config.ADDRESS +'/api/courses/unenroll-course/' + courseId)
    .then(res =>{
      dispatch({
        type: GET_SUCCESS,
        payload: {data: 'Đã hủy ghi danh thành công'}
      })
      dispatch(getCourseInfo(courseId))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// get curent user courses
export const getCurentCourse = () => dispatch => {
  dispatch(setAllCourseLoading())
  axios
    .get(config.ADDRESS +'/api/courses/current')
    .then(res =>
      dispatch({
        type: GET_CURRENT_COURSES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CURRENT_COURSES,
        payload: {}
      })
    );
};

export const setAllCourseLoading = () => {
  return {
    type: ALLCOURSE_LOADING
  };
};

// lấy hết khóa học chưa hết hạn ghi danh
export const getAllCourse = () => dispatch => {
  dispatch(setAllCourseLoading())
  socket.emit("all_course");
  socket.on("get_all_course", 
    res =>{
      dispatch({
        type: GET_ALL_COURSES,
        payload: res
      })
    }
  );
};

export const setCourseInfoLoading = () => {
  return {
    type: COURSE_INFO_LOADING
  };
};

// lấy thông tin chi tiết của 1 khóa học
export const getGuestCourseInfo = (courseId) => dispatch => {
  dispatch(setAllCourseLoading())
  socket.emit("course_info", courseId);
  socket.on("get_course_info", 
    res =>{
      dispatch({
        type: GET_GUEST_COURSE_INFO,
        payload: res
      })
    }
  );
};

// lấy thông tin chi tiết của 1 khóa học
export const getCourseInfo = (courseId) => dispatch => {
  dispatch(setCourseInfoLoading())
  axios
    .get(config.ADDRESS +`/api/courses/course-info/${courseId}`)
    .then(res =>
      dispatch({
        type: GET_COURSE_INFO,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_COURSE_INFO,
        payload: {}
      })
    );
};

// lấy tất cả các khóa học
export const getManageCourses = () => dispatch => {
  dispatch(setAllCourseLoading())
  axios
    .get(config.ADDRESS +`/api/courses/manage-courses`)
    .then(res =>
      dispatch({
        type: GET_MANAGE_COURSES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_MANAGE_COURSES,
        payload: {}
      })
    );
};

// lấy các khóa học đang hoạt động
export const getActiveCourses = () => dispatch => {
  dispatch(setAllCourseLoading())
  axios
    .get(config.ADDRESS +`/api/courses/get-active-course`)
    .then(res =>
      dispatch({
        type: GET_ACTIVE_COURSES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ACTIVE_COURSES,
        payload: {}
      })
    );
};

// get student courses by student id
export const getStudentCourse = (studentId) => dispatch => {
  dispatch(setAllCourseLoading())
  axios
    .get(config.ADDRESS +'/api/courses/' + studentId)
    .then(res =>
      dispatch({
        type: GET_STUDENT_COURSES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_STUDENT_COURSES,
        payload: {}
      })
    );
};

// join course
export const joinCourse = (courseId) => dispatch => {
  axios
    .post(config.ADDRESS +'/api/courses/join-course/' + courseId)
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
