import {
  GET_LESSON_LIST,
  LESSON_LOADING,
  GET_LESSON,
  GET_LESSON_TOTAL_LIST,
  GET_LESSON_IN_COURSE,
  GET_LESSON_LIST_INFO
} from '../actions/types';

const initialState = {
  lesson: {},
  lesson_list: [],
  list_info:{},
  lesson_total_list:[],
  lesson_in_course: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_LESSON_LIST:
      return {
        ...state,
        lesson_list: action.payload,
        loading: false
      };
    case GET_LESSON_LIST_INFO:
      return {
        ...state,
        list_info: action.payload,
        loading: false
      };
    case GET_LESSON:
      return {
        ...state,
        lesson: action.payload,
        loading: false
      };
    case GET_LESSON_TOTAL_LIST:
      return {
        ...state,
        lesson_total_list: action.payload,
        loading: false
      };
    case GET_LESSON_IN_COURSE:
      return {
        ...state,
        lesson_in_course: action.payload,
        loading: false
      };
    case LESSON_LOADING:
      return {
        ...state,
        loading: true
      }
    default:
      return state;
  }
}
