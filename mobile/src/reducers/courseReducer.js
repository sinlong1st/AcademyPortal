import {
  GET_CURRENT_COURSES,
  GET_ALL_COURSES,
  ALLCOURSE_LOADING,
  GET_COURSE_INFO,
  GET_MANAGE_COURSES,
  GET_STUDENT_COURSES,
  COURSE_INFO_LOADING
} from '../actions/types';

const initialState = {
  courseinfo: {
    course: {},
    course_detail: {}
  },
  allcourses: [],
  currentcourses: [],
  studentcourses: [],
  managecourses: [],
  loading: false,
  loadingCourseInfo: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CURRENT_COURSES:
      return {
        ...state,
        currentcourses: action.payload,
        loading: false
      };
    case GET_ALL_COURSES:
      return {
        ...state,
        allcourses: action.payload,
        loading: false
      };
    case GET_STUDENT_COURSES:
      return {
        ...state,
        studentcourses: action.payload,
        loading: false
      };
    case ALLCOURSE_LOADING:
      return {
        ...state,
        loading: true
      };
    case COURSE_INFO_LOADING:
      return {
        ...state,
        loadingCourseInfo: true
      };
    case GET_COURSE_INFO:
      return {
        ...state,
        courseinfo: action.payload,
        loadingCourseInfo: false
      };
    case GET_MANAGE_COURSES:
      return {
        ...state,
        managecourses: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
