import {
  GET_MY_RATING,
  RATING_LOADING,
  GET_MY_TEACHER_RATING,
  GET_TEACHERS_RATING,
  TEACHER_RATING_LOADING,
  GET_TEACHER_RATING
} from '../actions/types';

const initialState = {
  my_rating: {},
  my_teacher_rating: [],
  teachers_rating: [],
  teacher_rating: {},
  loading: false,
  loadingT: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_MY_RATING:
      return {
        ...state,
        my_rating: action.payload,
        loading: false
      };
    case GET_TEACHERS_RATING:
      return {
        ...state,
        teachers_rating: action.payload,
        loading: false
      };
    case GET_MY_TEACHER_RATING:
      return {
        ...state,
        my_teacher_rating: action.payload,
        loading: false
      };
    case GET_TEACHER_RATING:
      return {
        ...state,
        teacher_rating: action.payload,
        loadingT: false
      };
    case RATING_LOADING:
      return {
        ...state,
        loading: true
      };
    case TEACHER_RATING_LOADING:
      return {
        ...state,
        loadingT: true
      };
    default:
      return state;
  }
}
